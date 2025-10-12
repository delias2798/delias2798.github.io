import './App.css'
import './index.css';
import BabylonScene from './components/BabylonScene';

function App() {
  return (
    <div className="app-container">
      <BabylonScene />
      <div className="welcome-overlay">
        <h1>Portfolio VR/XR</h1>
        <p>Explora mis proyectos en realidad virtual y aumentada</p>
        <div className="instructions">
          <p>🖱️ <strong>Click Izquierdo:</strong> Ver pantallas/proyectos</p>
          <p>🎮 <strong>Click Derecho:</strong> Agarrar y mover objetos</p>
          <p>🔄 <strong>Drag:</strong> Rotar cámara</p>
        </div>
      </div>
    </div>
  );
}

export default App;
