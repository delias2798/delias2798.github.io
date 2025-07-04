import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './index.css';
import BabylonScene from './components/BabylonScene';

function App() {
  return (
    <div className="container">
      <BabylonScene />
      <div className="overlay-ui">
        <button onClick={() => console.log('Menú')}>Menú</button>
        <h1>Bienvenido</h1>
      </div>
    </div>
  );
}

export default App;
