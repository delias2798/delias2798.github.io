import React, { useEffect, useRef } from "react";
import {
    Engine,
    Scene,
    ArcRotateCamera,
    HemisphericLight,
    Vector3,
    SceneLoader,
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF"; // 👈 NECESARIO para .glb

const BabylonScene: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const engine = new Engine(canvasRef.current, true);
        const scene = new Scene(engine);

        const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 5, Vector3.Zero(), scene);
        camera.attachControl(canvasRef.current, true);

        new HemisphericLight("light", new Vector3(1, 1, 0), scene);

        SceneLoader.ImportMeshAsync("", "/models/", "furniture.glb", scene)
            .then(() => console.log("✅ Modelo cargado"))
            .catch((err) => console.error("❌ Error cargando modelo:", err));

        engine.runRenderLoop(() => {
            scene.render();
        });
        engine.resize();

        const handleResize = () => engine.resize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            scene.dispose();
            engine.dispose();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: "100vw",
                height: "100vh",
                display: "block",
            }}
        />
    );
};

export default BabylonScene;
