import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Homepage from "../home/Homepage";
import ChatbotComponent from "../chatbot/ChatbotComponent";
import LaunchComponent from "../launch/LaunchComponent";
import UpcomingComponent from "../upcoming/UpcomingComponent";
import HistoryComponent from "../history/HistoryComponent";
import APODComponent from "../apod/APODComponent";
import MarsRoverComponent from "../mars/MarsRoverComponent";
import NearEarthObjectsComponent from "../neo/NearEarthObjectsComponent";
import ISSTrackerComponent from "../iss/ISSTrackerComponent";
import "./AppLayout.css";

const AppLayout = () => {
  const [frameVisible, setFrameVisible] = useState(true);

  const animateFrame = () => {
    setFrameVisible(false);
    setTimeout(() => {
      setFrameVisible(true);
    }, 600);
  };

  return (
    <div className="app-layout">
      <Header onNav={animateFrame} />

      <main className="main-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className={`content-frame ${frameVisible ? "visible" : "hidden"}`}>
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/launch" element={<LaunchComponent />} />
                  <Route path="/upcoming" element={<UpcomingComponent />} />
                  <Route path="/history" element={<HistoryComponent />} />
                  <Route path="/apod" element={<APODComponent />} />
                  <Route path="/mars" element={<MarsRoverComponent />} />
                  <Route path="/neo" element={<NearEarthObjectsComponent />} />
                  <Route path="/iss" element={<ISSTrackerComponent />} />
                  <Route path="/chatbot" element={<ChatbotComponent />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AppLayout;
