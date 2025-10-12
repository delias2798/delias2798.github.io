import {
    Scene,
    MeshBuilder,
    StandardMaterial,
    Color3,
    Vector3,
    Mesh,
    PhysicsAggregate,
    PhysicsShapeType,
    AbstractMesh,
    Quaternion,
} from '@babylonjs/core';

interface InteractiveObject {
    mesh: Mesh;
    physicsAggregate: PhysicsAggregate;
    originalPosition: Vector3;
    isGrabbed: boolean;
}

export class InteractiveObjectsManager {
    private scene: Scene;
    private objects: InteractiveObject[] = [];
    private grabbedObject: InteractiveObject | null = null;
    private grabDistance: number = 0;
    private fallThreshold: number = -2; // Y position donde se considera "caído"

    constructor(scene: Scene) {
        this.scene = scene;
    }

    /**
     * Crear los objetos interactivos (3 esferas, 2 cubos)
     */
    async createObjects(): Promise<void> {
        // Crear 3 esferas
        for (let i = 0; i < 3; i++) {
            const sphere = this.createSphere(`sphere${i}`, new Vector3(-2 + i * 2, 1.5, 2));
            this.objects.push(sphere);
        }

        // Crear 2 cubos
        for (let i = 0; i < 2; i++) {
            const cube = this.createCube(`cube${i}`, new Vector3(-1 + i * 2, 1.5, 3));
            this.objects.push(cube);
        }

        // Setup interacciones
        this.setupInteractions();

        // Setup sistema de detección de caída
        this.setupFallDetection();
    }

    /**
     * Crear una esfera interactiva
     */
    private createSphere(name: string, position: Vector3): InteractiveObject {
        const sphere = MeshBuilder.CreateSphere(name, {
            diameter: 0.3,
            segments: 16
        }, this.scene);

        sphere.position = position.clone();
        sphere.isPickable = true; // Permitir selección con raycasting

        // Material
        const material = new StandardMaterial(`${name}Material`, this.scene);
        material.diffuseColor = new Color3(
            Math.random(),
            Math.random(),
            Math.random()
        );
        material.specularColor = new Color3(0.5, 0.5, 0.5);
        sphere.material = material;

        // Física
        const physicsAggregate = new PhysicsAggregate(
            sphere,
            PhysicsShapeType.SPHERE,
            { mass: 1, restitution: 0.5, friction: 0.5 },
            this.scene
        );

        return {
            mesh: sphere,
            physicsAggregate: physicsAggregate,
            originalPosition: position.clone(),
            isGrabbed: false
        };
    }

    /**
     * Crear un cubo interactivo
     */
    private createCube(name: string, position: Vector3): InteractiveObject {
        const cube = MeshBuilder.CreateBox(name, {
            size: 0.3
        }, this.scene);

        cube.position = position.clone();
        cube.isPickable = true; // Permitir selección con raycasting

        // Material
        const material = new StandardMaterial(`${name}Material`, this.scene);
        material.diffuseColor = new Color3(
            Math.random(),
            Math.random(),
            Math.random()
        );
        material.specularColor = new Color3(0.5, 0.5, 0.5);
        cube.material = material;

        // Física
        const physicsAggregate = new PhysicsAggregate(
            cube,
            PhysicsShapeType.BOX,
            { mass: 1, restitution: 0.3, friction: 0.5 },
            this.scene
        );

        return {
            mesh: cube,
            physicsAggregate: physicsAggregate,
            originalPosition: position.clone(),
            isGrabbed: false
        };
    }

    /**
     * Configurar interacciones de mouse
     */
    private setupInteractions(): void {
        // Usar un único observer para todos los eventos de pointer
        this.scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case 2: // POINTERDOWN
                    this.handlePointerDown(pointerInfo.event as PointerEvent);
                    break;
                case 4: // POINTERUP
                    this.handlePointerUp(pointerInfo.event as PointerEvent);
                    break;
                case 8: // POINTERMOVE
                    this.handlePointerMove();
                    break;
            }
        });

        // ALTERNATIVA: Actualizar en cada frame si hay objeto agarrado
        this.scene.onBeforeRenderObservable.add(() => {
            if (this.grabbedObject) {
                this.moveGrabbedObject();
            }
        });

        // Prevenir menú contextual en canvas
        const canvas = this.scene.getEngine().getRenderingCanvas();
        if (canvas) {
            canvas.addEventListener('contextmenu', (e) => {
                if (this.grabbedObject) {
                    e.preventDefault();
                }
            });
        }
    }

    /**
     * Manejar pointer down (SOLO BOTÓN DERECHO)
     */
    private handlePointerDown(pointerEvent: PointerEvent): void {
        // Solo intentar agarrar si no hay objeto ya agarrado
        if (this.grabbedObject) return;

        // SOLO botón derecho (button index 2)
        if (!pointerEvent || pointerEvent.button !== 2) {
            return; // Ignorar botón izquierdo y medio
        }

        const pickResult = this.scene.pick(
            this.scene.pointerX,
            this.scene.pointerY
        );

        if (pickResult.hit && pickResult.pickedMesh) {
            const pickedObject = this.objects.find(obj => obj.mesh === pickResult.pickedMesh);
            
            if (pickedObject) {
                this.grabObject(pickedObject, pickResult.distance || 5);
                // Prevenir menú contextual
                if (pointerEvent) {
                    pointerEvent.preventDefault();
                }
            }
        }
    }

    /**
     * Manejar pointer up (SOLO BOTÓN DERECHO)
     */
    private handlePointerUp(pointerEvent: PointerEvent): void {
        // Solo procesar botón derecho
        if (!pointerEvent || pointerEvent.button !== 2) {
            return;
        }

        if (this.grabbedObject) {
            this.releaseObject();
        }
    }

    /**
     * Manejar pointer move
     */
    private handlePointerMove(): void {
        if (this.grabbedObject) {
            this.moveGrabbedObject();
        }
    }

    /**
     * Agarrar un objeto (CON BOTÓN DERECHO)
     */
    private grabObject(object: InteractiveObject, distance: number): void {
        this.grabbedObject = object;
        this.grabDistance = distance;
        object.isGrabbed = true;

        // NO desactivar la cámara - permite que funcione mientras agarras con botón derecho
        
        // Hacer el objeto kinematic (no afectado por gravedad mientras se agarra)
        try {
            object.physicsAggregate.body.setMotionType(1); // 1 = MOTION_TYPE_KINEMATIC
            object.physicsAggregate.body.setLinearVelocity(Vector3.Zero());
            object.physicsAggregate.body.setAngularVelocity(Vector3.Zero());
        } catch (error) {
            console.error('Error configurando física kinematic:', error);
        }
        
        // Cambiar color del objeto para indicar que está agarrado
        const material = object.mesh.material as StandardMaterial;
        if (material) {
            material.emissiveColor = new Color3(0.3, 0.3, 0);
        }
        
        console.log(`🎯 Objeto agarrado: ${object.mesh.name} (BOTÓN DERECHO)`);
        console.log(`   Distancia: ${distance.toFixed(2)}`);
    }

    /**
     * Soltar objeto
     */
    private releaseObject(): void {
        if (this.grabbedObject) {
            this.grabbedObject.isGrabbed = false;
            
            // Volver a hacer el objeto dinámico
            this.grabbedObject.physicsAggregate.body.setMotionType(2); // 2 = MOTION_TYPE_DYNAMIC
            
            // Restaurar color
            const material = this.grabbedObject.mesh.material as StandardMaterial;
            if (material) {
                material.emissiveColor = Color3.Black();
            }
            
            console.log(`🎯 Objeto soltado: ${this.grabbedObject.mesh.name}`);
            
            this.grabbedObject = null;
        }
    }

    /**
     * Mover objeto agarrado siguiendo el puntero
     */
    private moveGrabbedObject(): void {
        if (!this.grabbedObject) return;

        const camera = this.scene.activeCamera;
        if (!camera) return;

        // Crear ray desde la cámara hacia el puntero
        const ray = this.scene.createPickingRay(
            this.scene.pointerX,
            this.scene.pointerY,
            null,
            camera
        );

        // Calcular nueva posición del objeto
        const newPosition = ray.origin.add(ray.direction.scale(this.grabDistance));
        
        // Actualizar posición del mesh directamente
        this.grabbedObject.mesh.position.copyFrom(newPosition);
        
        // Para física Havok con kinematic motion type, sincronizar transform
        const physicsBody = this.grabbedObject.physicsAggregate.body;
        if (physicsBody && physicsBody.transformNode) {
            physicsBody.transformNode.position.copyFrom(newPosition);
            if (this.grabbedObject.mesh.rotationQuaternion) {
                physicsBody.transformNode.rotationQuaternion = this.grabbedObject.mesh.rotationQuaternion.clone();
            }
        }
        
        // Debug: mostrar que se está moviendo (ACTIVADO TEMPORALMENTE)
        console.log('🔄 Moviendo objeto a:', newPosition.x.toFixed(2), newPosition.y.toFixed(2), newPosition.z.toFixed(2));
    }

    /**
     * Detectar objetos caídos y hacer respawn
     */
    private setupFallDetection(): void {
        this.scene.onBeforeRenderObservable.add(() => {
            this.objects.forEach(obj => {
                if (!obj.isGrabbed && obj.mesh.position.y < this.fallThreshold) {
                    this.respawnObject(obj);
                }
            });
        });
    }

    /**
     * Hacer respawn de un objeto a su posición original
     */
    private respawnObject(object: InteractiveObject): void {
        // Resetear posición
        object.mesh.position = object.originalPosition.clone();
        
        // Resetear física
        const quaternion = object.mesh.rotationQuaternion || Quaternion.Identity();
        object.physicsAggregate.body.setTargetTransform(
            object.originalPosition,
            quaternion
        );
        object.physicsAggregate.body.setLinearVelocity(Vector3.Zero());
        object.physicsAggregate.body.setAngularVelocity(Vector3.Zero());

        console.log(`Respawned ${object.mesh.name}`);
    }

    /**
     * Obtener todos los meshes de objetos (para excluir en raycasting)
     */
    getObjectMeshes(): AbstractMesh[] {
        return this.objects.map(obj => obj.mesh);
    }

    /**
     * Limpiar recursos
     */
    dispose(): void {
        this.objects.forEach(obj => {
            obj.physicsAggregate.dispose();
            obj.mesh.dispose();
        });
        this.objects = [];
    }
}

