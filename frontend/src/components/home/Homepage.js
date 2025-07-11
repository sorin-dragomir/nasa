import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSound } from "../../contexts/SoundContext";
import NASAAPIService from "../../services/NASAAPIService";
import "./Homepage.css";

const Homepage = () => {
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { playSound } = useSound();
  const navigate = useNavigate();

  const nasaAPI = useMemo(() => new NASAAPIService(), []);

  useEffect(() => {
    const loadAPOD = async () => {
      try {
        setLoading(true);
        const data = await nasaAPI.getAPOD();
        // Only use image type APOD for background
        if (data && data.media_type === 'image') {
          setApodData(data);
        }
      } catch (err) {
        console.log("Failed to load APOD, using default background");
      } finally {
        setLoading(false);
      }
    };

    loadAPOD();
  }, [nasaAPI]);

  const handleExploreClick = () => {
    playSound("click");
    // Scroll to content or navigate to a specific section
    const mainContent = document.querySelector('.explanation-section');
    if (mainContent) {
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateToFeature = (path, feature) => {
    playSound("click");
    navigate(path);
  };

  const getBackgroundImage = () => {
    if (apodData && apodData.media_type === 'image') {
      return apodData.url;
    }
    return '/img/background-large.jpg'; // Fallback to default NASA image
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section 
        className="hero-section"
        style={{
          backgroundImage: `url(${getBackgroundImage()})`,
        }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                NASA Data Explorer
              </h1>
              <p className="hero-subtitle">
                Discover the cosmos through NASA's incredible data and imagery. 
                Explore Mars rover photos, track space missions, and witness the beauty of our universe.
              </p>
              <button 
                className="cta-button"
                onClick={handleExploreClick}
                aria-label="Start exploring NASA data"
              >
                <span className="cta-text">Start Exploring</span>
                <div className="cta-glow"></div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Explanation Section */}
      <section className="explanation-section">
        <div className="container">
          <div className="explanation-content">
            <h2 className="section-title">Explore the Universe</h2>
            <p className="section-description">
              Our NASA Data Explorer brings you closer to space than ever before. 
              Access real-time data, stunning imagery, and fascinating insights from various NASA missions and programs.
            </p>
            
            <div className="features-grid">
              <div className="feature-card" onClick={() => handleNavigateToFeature('/mars', 'Mars Rover')}>
                <div className="feature-icon">🔴</div>
                <h3>Mars Rover Photos</h3>
                <p>Explore high-resolution images captured by NASA's Mars rovers including Curiosity, Opportunity, and Spirit.</p>
                <div className="feature-cta">Explore Mars →</div>
              </div>

              <div className="feature-card" onClick={() => handleNavigateToFeature('/launch', 'Launches')}>
                <div className="feature-icon">🚀</div>
                <h3>Space Missions</h3>
                <p>Track upcoming launches, view mission history, and schedule new space exploration missions.</p>
                <div className="feature-cta">View Missions →</div>
              </div>

              <div className="feature-card" onClick={() => handleNavigateToFeature('/apod', 'APOD')}>
                <div className="feature-icon">🌌</div>
                <h3>Astronomy Picture of the Day</h3>
                <p>Discover breathtaking space imagery with detailed explanations from NASA's astronomers.</p>
                <div className="feature-cta">View APOD →</div>
              </div>

              <div className="feature-card" onClick={() => handleNavigateToFeature('/iss', 'ISS Tracker')}>
                <div className="feature-icon">🛰️</div>
                <h3>ISS Live Tracker</h3>
                <p>Track the International Space Station in real-time and see when it passes over your location.</p>
                <div className="feature-cta">Track ISS →</div>
              </div>

              <div className="feature-card" onClick={() => handleNavigateToFeature('/neo', 'Near Earth Objects')}>
                <div className="feature-icon">☄️</div>
                <h3>Near Earth Objects</h3>
                <p>Monitor asteroids and comets that come close to Earth with detailed orbital information.</p>
                <div className="feature-cta">Monitor NEOs →</div>
              </div>

              <div className="feature-card" onClick={() => handleNavigateToFeature('/upcoming', 'Upcoming')}>
                <div className="feature-icon">📅</div>
                <h3>Upcoming Events</h3>
                <p>Stay updated with scheduled launches, astronomical events, and mission milestones.</p>
                <div className="feature-cta">View Events →</div>
              </div>
            </div>

            {apodData && (
              <div className="apod-credit">
                <p className="credit-text">
                  <strong>Today's Background:</strong> {apodData.title}
                  {apodData.copyright && ` © ${apodData.copyright}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
