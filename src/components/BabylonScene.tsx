import React, { useEffect, useRef, useState } from "react";
import {
    Engine,
    Scene,
    ArcRotateCamera,
    HemisphericLight,
    Vector3,
    // SceneLoader, // Comentado temporalmente (furniture.glb desactivado)
    MeshBuilder,
    StandardMaterial,
    Color3,
    Color4,
    HavokPlugin,
    PhysicsAggregate,
    PhysicsShapeType,
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import HavokPhysics from "@babylonjs/havok";
import { CameraController } from "../babylon/CameraController";
import { ScreenManager } from "../babylon/ScreenManager";
import { InteractiveObjectsManager } from "../babylon/InteractiveObjects";
import { projects } from "../data/projects";
import type { Project } from "../types/Project";
import ProjectOverlay from "./ProjectOverlay";

const BabylonScene: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentProject, setCurrentProject] = useState<Project | null>(null);
    const [currentProjectIndex, setCurrentProjectIndex] = useState<number>(0);
    const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(false);
    
    // Referencias para acceder a los managers desde event handlers
    const sceneRef = useRef<Scene | null>(null);
    const cameraControllerRef = useRef<CameraController | null>(null);
    const screenManagerRef = useRef<ScreenManager | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const initScene = async () => {
            try {
                const engine = new Engine(canvasRef.current!, true);
        const scene = new Scene(engine);
                sceneRef.current = scene;

                // Color de fondo más visible (azul oscuro en lugar de gris)
                scene.clearColor = new Color4(0.1, 0.1, 0.2, 1);

                console.log('🎬 Iniciando escena BabylonJS...');

                // Configurar física Havok
                try {
                    console.log('⚙️ Cargando Havok Physics...');
                    const havokInstance = await HavokPhysics();
                    const havokPlugin = new HavokPlugin(true, havokInstance);
                    scene.enablePhysics(new Vector3(0, -9.81, 0), havokPlugin);
                    console.log('✅ Havok Physics cargado');
                } catch (error) {
                    console.error('❌ Error cargando Havok Physics:', error);
                    console.warn('⚠️ Continuando sin física...');
                }

            // Cámara
            const camera = new ArcRotateCamera(
                "camera",
                -Math.PI / 2, // Rotación horizontal
                Math.PI / 2.5, // Rotación vertical (más bajo)
                15, // Distancia más cercana
                new Vector3(0, 1, 0), // Apuntar ligeramente arriba
                scene
            );
            camera.attachControl(canvasRef.current!, true);
            camera.lowerRadiusLimit = 5;
            camera.upperRadiusLimit = 30;
            camera.lowerBetaLimit = 0.1;
            camera.upperBetaLimit = (Math.PI / 2) * 0.99;
            camera.wheelPrecision = 50; // Hacer zoom más suave
            camera.panningSensibility = 0; // Deshabilitar panning

            // Iluminación mejorada
            const hemisphericLight = new HemisphericLight(
                "hemisphericLight",
                new Vector3(0, 1, 0),
                scene
            );
            hemisphericLight.intensity = 0.7;

            // Luz direccional para mejor contraste
            const directionalLight = new HemisphericLight(
                "directionalLight",
                new Vector3(1, 1, -1),
                scene
            );
            directionalLight.intensity = 0.5;

            // Crear plano de piso con física (bajado para no traslaparse con furniture.glb)
            const ground = MeshBuilder.CreateGround(
                "ground",
                { width: 30, height: 30 },
                scene
            );
            const groundMaterial = new StandardMaterial("groundMaterial", scene);
            groundMaterial.diffuseColor = new Color3(0.2, 0.2, 0.25);
            groundMaterial.specularColor = new Color3(0.1, 0.1, 0.1);
            ground.material = groundMaterial;
            ground.position.y = -0.5; // Bajado para evitar Z-fighting con furniture.glb
            ground.receiveShadows = true;
            ground.isPickable = false; // No interferir con raycasting de objetos interactivos

            // Agregar física al piso (solo si Havok está disponible)
            if (scene.getPhysicsEngine()) {
                new PhysicsAggregate(
                    ground,
                    PhysicsShapeType.BOX,
                    { mass: 0, restitution: 0.5, friction: 0.5 },
                    scene
                );
            }

            // Agregar objeto de referencia visible (para debug)
            // const debugBox = MeshBuilder.CreateBox(
            //     "debugBox",
            //     { size: 2 },
            //     scene
            // );
            // debugBox.position = new Vector3(0, 1, 0);
            // debugBox.isPickable = false; // No interferir con interacciones
            // const debugMaterial = new StandardMaterial("debugMaterial", scene);
            // debugMaterial.diffuseColor = new Color3(1, 0, 0); // Rojo brillante
            // debugMaterial.emissiveColor = new Color3(0.2, 0, 0); // Emisivo para que se vea
            // debugBox.material = debugMaterial;
            // console.log('📦 Cubo de debug creado en:', debugBox.position);

            // Cargar modelo de mueble (DESACTIVADO TEMPORALMENTE)
            // SceneLoader.ImportMeshAsync("", "/models/", "furniture.glb", scene)
            //     .then((result) => {
            //         console.log("✅ Modelo cargado");
            //         
            //         // Ajustar posición y configuración del mueble
            //         if (result.meshes.length > 0) {
            //             result.meshes[0].position.y = 0;
            //             
            //             // Hacer que el mueble no interfiera con objetos interactivos
            //             result.meshes.forEach(mesh => {
            //                 mesh.isPickable = false;
            //             });
            //         }
            //     })
            //     .catch((err) => console.error("❌ Error cargando modelo:", err));
            
            console.log('⚠️ Furniture.glb desactivado temporalmente');

            // Inicializar Camera Controller
            console.log('📷 Inicializando Camera Controller...');
            const cameraController = new CameraController(camera, scene);
            cameraControllerRef.current = cameraController;

            // Inicializar Screen Manager
            console.log('🎬 Inicializando Screen Manager...');
            const screenManager = new ScreenManager(scene, projects);
            screenManagerRef.current = screenManager;

            // Callback cuando cambia el proyecto
            screenManager.onProjectChange((project, index) => {
                setCurrentProject(project);
                setCurrentProjectIndex(index);
            });

            // Establecer proyecto inicial
            setCurrentProject(screenManager.getCurrentProject());
            setCurrentProjectIndex(screenManager.getCurrentIndex());

            // Inicializar Interactive Objects Manager (solo si hay física)
            let interactiveObjects: InteractiveObjectsManager | null = null;
            if (scene.getPhysicsEngine()) {
                try {
                    console.log('🎮 Inicializando objetos interactivos...');
                    interactiveObjects = new InteractiveObjectsManager(scene);
                    await interactiveObjects.createObjects();
                    console.log('✅ Objetos interactivos creados');
                } catch (error) {
                    console.error('❌ Error creando objetos interactivos:', error);
                }
            } else {
                console.warn('⚠️ No hay física disponible, objetos interactivos deshabilitados');
            }

            // Setup click handler para enfocar pantalla (SOLO BOTÓN IZQUIERDO)
            scene.onPointerObservable.add((pointerInfo) => {
                if (pointerInfo.type === 2) { // POINTERDOWN
                    // Solo procesar botón izquierdo (botón derecho es para objetos)
                    const pointerEvent = pointerInfo.event as PointerEvent;
                    if (pointerEvent && pointerEvent.button !== 0) {
                        return; // Ignorar botón derecho y medio
                    }

                    const pickResult = scene.pick(scene.pointerX, scene.pointerY);

                    if (pickResult.hit && pickResult.pickedMesh) {
                        // Verificar si es un objeto interactivo
                        const isInteractiveObject = interactiveObjects && 
                            interactiveObjects.getObjectMeshes().includes(pickResult.pickedMesh);
                        
                        if (isInteractiveObject) {
                            // No hacer nada, los objetos interactivos tienen prioridad
                            return;
                        }

                        // Verificar si clickeó en la pantalla
                        if (pickResult.pickedMesh === screenManager.getScreenMesh()) {
                            if (cameraController.isNormal()) {
                                // Enfocar pantalla (pasar el mesh completo para calcular rotación)
                                const screenMesh = screenManager.getScreen();
                                cameraController.focusOn(screenMesh, 5, () => {
                                    setIsOverlayVisible(true);
                                });
                            }
                        } else if (cameraController.isFocused()) {
                            // Clickeó fuera de la pantalla
                            exitFocusMode();
                        }
                    }
                }
            });

            // Setup listener para tecla ESC
            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.key === "Escape" && cameraController.isFocused()) {
                    exitFocusMode();
                }
            };
            window.addEventListener("keydown", handleKeyDown);

            // Setup listener para scroll
            const handleWheel = (event: WheelEvent) => {
                if (event.deltaY > 0 && cameraController.isFocused()) {
                    exitFocusMode();
                }
            };
            window.addEventListener("wheel", handleWheel);

            // Función para salir del modo focus
            const exitFocusMode = () => {
                if (cameraControllerRef.current?.isFocused()) {
                    setIsOverlayVisible(false);
                    cameraControllerRef.current.reset();
                }
            };

            // Render loop
            console.log('🎨 Iniciando render loop...');
        engine.runRenderLoop(() => {
            scene.render();
        });

            // Resize handler
        const handleResize = () => engine.resize();
        window.addEventListener("resize", handleResize);

            console.log('✅ Escena BabylonJS iniciada correctamente');

            // Debug mode con ?debug=true (sin inspector por conflictos de dependencias)
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('debug') === 'true') {
                console.log('🔍 Modo Debug Activado');
                console.log('📊 Información de la escena:');
                console.log('  - Meshes:', scene.meshes.length);
                console.log('  - Materiales:', scene.materials.length);
                console.log('  - Luces:', scene.lights.length);
                console.log('  - Cámara:', camera.name);
                console.log('  - Physics Engine:', scene.getPhysicsEngine() ? 'Havok' : 'None');
                
                // Hacer accesibles en consola para debugging
                (window as any).scene = scene;
                (window as any).camera = camera;
                (window as any).engine = engine;
                (window as any).screenManager = screenManagerRef.current;
                
                console.log('💡 Variables disponibles en consola:');
                console.log('  - window.scene');
                console.log('  - window.camera');
                console.log('  - window.engine');
                console.log('  - window.screenManager');
            }

            // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
                window.removeEventListener("keydown", handleKeyDown);
                window.removeEventListener("wheel", handleWheel);
                screenManager.dispose();
                if (interactiveObjects) {
                    interactiveObjects.dispose();
                }
            scene.dispose();
            engine.dispose();
            };

            } catch (error) {
                console.error('❌ Error fatal inicializando la escena:', error);
                throw error;
            }
        };

        let cleanupFn: (() => void) | null = null;
        
        initScene()
            .then((cleanup) => {
                cleanupFn = cleanup;
            })
            .catch((error) => {
                console.error('❌ Error en initScene:', error);
            });

        return () => {
            if (cleanupFn) {
                cleanupFn();
            }
        };
    }, []);

    // Handlers para el overlay
    const handleCloseOverlay = () => {
        setIsOverlayVisible(false);
        if (cameraControllerRef.current) {
            cameraControllerRef.current.reset();
        }
    };

    const handleNext = () => {
        if (screenManagerRef.current) {
            screenManagerRef.current.next();
        }
    };

    const handlePrevious = () => {
        if (screenManagerRef.current) {
            screenManagerRef.current.previous();
        }
    };

    return (
        <>
        <canvas
            ref={canvasRef}
            style={{
                width: "100vw",
                height: "100vh",
                display: "block",
            }}
        />
            <ProjectOverlay
                project={currentProject}
                isVisible={isOverlayVisible}
                onClose={handleCloseOverlay}
                onNext={handleNext}
                onPrevious={handlePrevious}
                currentIndex={currentProjectIndex}
                totalProjects={projects.length}
            />
        </>
    );
};

export default BabylonScene;
