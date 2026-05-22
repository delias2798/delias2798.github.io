import React, { useEffect, useRef, useState } from "react";
import {
    Engine,
    Scene,
    ArcRotateCamera,
    HemisphericLight,
    Vector3,
    // SceneLoader, // Comentado temporalmente (furniture.glb desactivado)
    MeshBuilder,
    Color4,
    HavokPlugin,
    PhysicsAggregate,
    PhysicsShapeType,
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import HavokPhysics from "@babylonjs/havok";
import { CameraController } from "../babylon/CameraController";
import { ScreenManager } from "../babylon/ScreenManager";
import {
    createEnvironmentGroundMaterial,
    setupPortfolioEnvironment,
} from "../babylon/SceneEnvironment";
import { getProjects } from "../data/projects";
import { SceneConfig } from "../config/scene.config";
import type { Locale } from "../types/Locale";
import type { Project } from "../types/Project";
import type { ScreenMediaState } from "../types/ScreenMedia";
import ProjectOverlay from "./ProjectOverlay";
import "../styles/BabylonScene.css";

interface BabylonSceneProps {
    locale: Locale;
}

const BabylonScene: React.FC<BabylonSceneProps> = ({ locale }) => {
    const localizedProjects = getProjects(locale);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sceneWrapperRef = useRef<HTMLDivElement>(null);
    const [currentProject, setCurrentProject] = useState<Project | null>(null);
    const [currentProjectIndex, setCurrentProjectIndex] = useState<number>(0);
    const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(false);
    const [screenMedia, setScreenMedia] = useState<ScreenMediaState>({
        mode: 'placeholder',
    });
    
    const sceneRef = useRef<Scene | null>(null);
    const engineRef = useRef<Engine | null>(null);
    const cameraControllerRef = useRef<CameraController | null>(null);
    const screenManagerRef = useRef<ScreenManager | null>(null);

    useEffect(() => {
        if (!canvasRef.current || !sceneWrapperRef.current) return;

        const initScene = async () => {
            try {
                const engine = new Engine(canvasRef.current!, true);
        const scene = new Scene(engine);
                sceneRef.current = scene;
                engineRef.current = engine;

                console.log('🎬 Iniciando escena BabylonJS...');

                try {
                    await setupPortfolioEnvironment(scene);
                    console.log('🌅 HDR cargado:', SceneConfig.environment.hdrUrl);
                } catch (hdrError) {
                    console.error('❌ HDR no cargó; usando fondo oscuro:', hdrError);
                    scene.clearColor = new Color4(0.08, 0.09, 0.12, 1);
                }

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
                Math.PI / 2, // +180° respecto a antes: frente de la pantalla (no la parte trasera)
                Math.PI / 2.5,
                15,
                new Vector3(0, 1, 0), // Apuntar ligeramente arriba
                scene
            );
            camera.attachControl(canvasRef.current!, true);
            camera.lowerRadiusLimit = 5;
            camera.upperRadiusLimit = 30;
            camera.lowerBetaLimit = 0.1;
            camera.upperBetaLimit = (Math.PI / 2) * 0.99;
            camera.panningSensibility = 0;
            // Sin zoom con scroll (rueda solo no acerca/aleja la cámara)
            camera.inputs.removeByType('ArcRotateCameraMouseWheelInput');

            // Iluminación mejorada
            const hemisphericLight = new HemisphericLight(
                "hemisphericLight",
                new Vector3(0, 1, 0),
                scene
            );
            hemisphericLight.intensity = SceneConfig.lighting.hemispheric.intensity;

            const directionalLight = new HemisphericLight(
                "directionalLight",
                new Vector3(1, 1, -1),
                scene
            );
            directionalLight.intensity = SceneConfig.lighting.directional.intensity;

            // Piso visual (sin física — evita que el mesh se mueva al colisionar)
            const ground = MeshBuilder.CreateGround(
                "ground",
                { width: 30, height: 30 },
                scene
            );
            const groundMaterial = createEnvironmentGroundMaterial(
                scene,
                'portfolioGroundMaterial',
            );
            ground.material = groundMaterial;
            ground.position.y = 0;
            ground.receiveShadows = true;
            ground.isPickable = false;

            // Colisionador estático invisible (no comparte mesh con el piso visual)
            if (scene.getPhysicsEngine()) {
                const groundCollider = MeshBuilder.CreateBox(
                    "groundPhysicsCollider",
                    { width: 30, height: 0.15, depth: 30 },
                    scene
                );
                groundCollider.position.y = -0.075;
                groundCollider.isVisible = false;
                groundCollider.isPickable = false;
                const groundPhysics = new PhysicsAggregate(
                    groundCollider,
                    PhysicsShapeType.BOX,
                    { mass: 0, friction: 0.8, restitution: 0.1 },
                    scene
                );
                groundPhysics.body.setMotionType(0);
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
            const screenManager = new ScreenManager(
                scene,
                localizedProjects,
                sceneWrapperRef.current!
            );
            screenManagerRef.current = screenManager;

            // Callback cuando cambia el proyecto
            screenManager.onProjectChange((project, index) => {
                setCurrentProject(project);
                setCurrentProjectIndex(index);
            });

            screenManager.onMediaStateChange((state) => {
                setScreenMedia(state);
            });

            // Establecer proyecto inicial
            setCurrentProject(screenManager.getCurrentProject());
            setCurrentProjectIndex(screenManager.getCurrentIndex());

            // Objetos agarrar/soltar desactivados por ahora (InteractiveObjectsManager)

            scene.onPointerObservable.add((pointerInfo) => {
                if (pointerInfo.type === 2) {
                    const pointerEvent = pointerInfo.event as PointerEvent;
                    if (pointerEvent && pointerEvent.button !== 0) {
                        return;
                    }

                    const pickResult = scene.pick(scene.pointerX, scene.pointerY);

                    if (pickResult.hit && pickResult.pickedMesh) {
                        if (pickResult.pickedMesh === screenManager.getScreenMesh()) {
                            if (cameraController.isNormal()) {
                                const screenMesh = screenManager.getScreen();
                                cameraController.focusOn(
                                    screenMesh,
                                    SceneConfig.camera.focusDistance,
                                    () => {
                                        setIsOverlayVisible(true);
                                    }
                                );
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
                screenManager.dispose();
            scene.dispose();
            engine.dispose();
            engineRef.current = null;
            sceneRef.current = null;
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

    useEffect(() => {
        if (screenManagerRef.current) {
            screenManagerRef.current.setProjects(getProjects(locale));
            const project = screenManagerRef.current.getCurrentProject();
            setCurrentProject(project);
            setCurrentProjectIndex(screenManagerRef.current.getCurrentIndex());
        }
    }, [locale]);

    // Handlers para el overlay
    const handleCloseOverlay = () => {
        setIsOverlayVisible(false);
        if (cameraControllerRef.current) {
            cameraControllerRef.current.reset();
        }
    };

    const changeProject = (direction: 'next' | 'prev') => {
        if (!screenManagerRef.current) return;

        // Mantener zoom y panel abiertos; solo cambia video + datos del overlay
        if (direction === 'next') {
            screenManagerRef.current.next();
        } else {
            screenManagerRef.current.previous();
        }
    };

    const handleNext = () => changeProject('next');
    const handlePrevious = () => changeProject('prev');

    const overlayYoutubeId =
        isOverlayVisible &&
        screenMedia.youtubeVideoId &&
        (screenMedia.mode === 'youtube-embed' ||
            screenMedia.mode === 'youtube-poster')
            ? screenMedia.youtubeVideoId
            : null;

    return (
        <div ref={sceneWrapperRef} className="babylon-scene-wrapper">
        <canvas
            ref={canvasRef}
            className="babylon-canvas"
        />
            <ProjectOverlay
                project={currentProject}
                isVisible={isOverlayVisible}
                locale={locale}
                youtubeVideoId={overlayYoutubeId}
                onClose={handleCloseOverlay}
                onNext={handleNext}
                onPrevious={handlePrevious}
                currentIndex={currentProjectIndex}
                totalProjects={localizedProjects.length}
            />
        </div>
    );
};

export default BabylonScene;
