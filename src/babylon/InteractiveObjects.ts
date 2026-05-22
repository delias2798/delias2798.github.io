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

const MOTION_STATIC = 0;
const MOTION_KINEMATIC = 1;

const OBJECT_SIZE = 0.3;
const OBJECT_HALF = OBJECT_SIZE / 2;
/** Superficie del colisionador del piso (y=0) */
const GROUND_SURFACE_Y = 0;
const SPAWN_Y = GROUND_SURFACE_Y + OBJECT_HALF + 0.02;

const SPAWN_POSITIONS = [
    new Vector3(-3, SPAWN_Y, 1),
    new Vector3(0, SPAWN_Y, 1),
    new Vector3(3, SPAWN_Y, 1),
    new Vector3(-2, SPAWN_Y, 2.6),
    new Vector3(2, SPAWN_Y, 2.6),
];

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
    private fallThreshold: number = -2;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    async createObjects(): Promise<void> {
        for (let i = 0; i < 3; i++) {
            this.objects.push(
                this.createSphere(`sphere${i}`, SPAWN_POSITIONS[i])
            );
        }

        for (let i = 0; i < 2; i++) {
            this.objects.push(
                this.createCube(`cube${i}`, SPAWN_POSITIONS[3 + i])
            );
        }

        this.setupInteractions();
        this.setupFallDetection();
    }

    private lockStaticBody(aggregate: PhysicsAggregate, position: Vector3): void {
        aggregate.body.setMotionType(MOTION_STATIC);
        aggregate.body.setTargetTransform(position, Quaternion.Identity());
        aggregate.body.setLinearVelocity(Vector3.Zero());
        aggregate.body.setAngularVelocity(Vector3.Zero());
    }

    private createSphere(name: string, position: Vector3): InteractiveObject {
        const sphere = MeshBuilder.CreateSphere(
            name,
            { diameter: OBJECT_SIZE, segments: 16 },
            this.scene
        );

        sphere.position.copyFrom(position);
        sphere.isPickable = true;

        const material = new StandardMaterial(`${name}Material`, this.scene);
        material.diffuseColor = new Color3(
            0.35 + Math.random() * 0.4,
            0.35 + Math.random() * 0.4,
            0.45 + Math.random() * 0.35
        );
        material.specularColor = new Color3(0.4, 0.4, 0.4);
        sphere.material = material;

        const physicsAggregate = new PhysicsAggregate(
            sphere,
            PhysicsShapeType.SPHERE,
            { mass: 1, restitution: 0.25, friction: 0.6 },
            this.scene
        );

        this.lockStaticBody(physicsAggregate, position);

        return {
            mesh: sphere,
            physicsAggregate,
            originalPosition: position.clone(),
            isGrabbed: false,
        };
    }

    private createCube(name: string, position: Vector3): InteractiveObject {
        const cube = MeshBuilder.CreateBox(
            name,
            { size: OBJECT_SIZE },
            this.scene
        );

        cube.position.copyFrom(position);
        cube.isPickable = true;

        const material = new StandardMaterial(`${name}Material`, this.scene);
        material.diffuseColor = new Color3(
            0.35 + Math.random() * 0.4,
            0.35 + Math.random() * 0.4,
            0.45 + Math.random() * 0.35
        );
        material.specularColor = new Color3(0.4, 0.4, 0.4);
        cube.material = material;

        const physicsAggregate = new PhysicsAggregate(
            cube,
            PhysicsShapeType.BOX,
            { mass: 1, restitution: 0.2, friction: 0.6 },
            this.scene
        );

        this.lockStaticBody(physicsAggregate, position);

        return {
            mesh: cube,
            physicsAggregate,
            originalPosition: position.clone(),
            isGrabbed: false,
        };
    }

    private setupInteractions(): void {
        this.scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case 2:
                    this.handlePointerDown(pointerInfo.event as PointerEvent);
                    break;
                case 4:
                    this.handlePointerUp(pointerInfo.event as PointerEvent);
                    break;
            }
        });

        this.scene.onBeforeRenderObservable.add(() => {
            if (this.grabbedObject) {
                this.moveGrabbedObject();
            }
        });

        const canvas = this.scene.getEngine().getRenderingCanvas();
        if (canvas) {
            canvas.addEventListener('contextmenu', (e) => {
                if (this.grabbedObject) e.preventDefault();
            });
        }
    }

    private handlePointerDown(pointerEvent: PointerEvent): void {
        if (this.grabbedObject) return;
        if (!pointerEvent || pointerEvent.button !== 2) return;

        const pickResult = this.scene.pick(this.scene.pointerX, this.scene.pointerY);

        if (pickResult.hit && pickResult.pickedMesh) {
            const pickedObject = this.objects.find(
                (obj) => obj.mesh === pickResult.pickedMesh
            );

            if (pickedObject) {
                this.grabObject(pickedObject, pickResult.distance || 5);
                pointerEvent.preventDefault();
            }
        }
    }

    private handlePointerUp(pointerEvent: PointerEvent): void {
        if (!pointerEvent || pointerEvent.button !== 2) return;
        if (this.grabbedObject) this.releaseObject();
    }

    private grabObject(object: InteractiveObject, distance: number): void {
        this.grabbedObject = object;
        this.grabDistance = distance;
        object.isGrabbed = true;

        try {
            object.physicsAggregate.body.setMotionType(MOTION_KINEMATIC);
            object.physicsAggregate.body.setLinearVelocity(Vector3.Zero());
            object.physicsAggregate.body.setAngularVelocity(Vector3.Zero());
        } catch (error) {
            console.error('Error configurando física kinematic:', error);
        }

        const material = object.mesh.material as StandardMaterial;
        if (material) {
            material.emissiveColor = new Color3(0.25, 0.25, 0.05);
        }
    }

    private releaseObject(): void {
        if (!this.grabbedObject) return;

        const object = this.grabbedObject;
        object.isGrabbed = false;

        this.lockStaticBody(
            object.physicsAggregate,
            object.mesh.position.clone()
        );

        const material = object.mesh.material as StandardMaterial;
        if (material) {
            material.emissiveColor = Color3.Black();
        }

        this.grabbedObject = null;
    }

    private moveGrabbedObject(): void {
        if (!this.grabbedObject) return;

        const camera = this.scene.activeCamera;
        if (!camera) return;

        const ray = this.scene.createPickingRay(
            this.scene.pointerX,
            this.scene.pointerY,
            null,
            camera
        );

        const newPosition = ray.origin.add(ray.direction.scale(this.grabDistance));
        this.grabbedObject.mesh.position.copyFrom(newPosition);

        const physicsBody = this.grabbedObject.physicsAggregate.body;
        if (physicsBody.transformNode) {
            physicsBody.transformNode.position.copyFrom(newPosition);
        }
        physicsBody.setTargetTransform(
            newPosition,
            this.grabbedObject.mesh.rotationQuaternion || Quaternion.Identity()
        );
    }

    private setupFallDetection(): void {
        this.scene.onBeforeRenderObservable.add(() => {
            this.objects.forEach((obj) => {
                if (!obj.isGrabbed && obj.mesh.position.y < this.fallThreshold) {
                    this.respawnObject(obj);
                }
            });
        });
    }

    private respawnObject(object: InteractiveObject): void {
        object.mesh.position.copyFrom(object.originalPosition);
        this.lockStaticBody(
            object.physicsAggregate,
            object.originalPosition
        );
    }

    getObjectMeshes(): AbstractMesh[] {
        return this.objects.map((obj) => obj.mesh);
    }

    dispose(): void {
        this.objects.forEach((obj) => {
            obj.physicsAggregate.dispose();
            obj.mesh.dispose();
        });
        this.objects = [];
    }
}
