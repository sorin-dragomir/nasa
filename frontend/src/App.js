import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppLayout } from "./components/layout";
import { SoundProvider } from "./contexts/SoundContext";
import "./App.css";

function App() {
  return (
    <Router>
      <SoundProvider>
        <div className="App">
          <AppLayout />
        </div>
      </SoundProvider>
    </Router>
  );
}

export default App;
