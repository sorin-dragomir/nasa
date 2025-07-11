import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Container, LoadingSpinner, FlipCard } from "../common";
import NASAAPIService from "../../services/NASAAPIService";
import "./ISSTrackerComponent.css";

const ISSTrackerComponent = () => {
  const [issLocation, setIssLocation] = useState(null);
  const [peopleInSpace, setPeopleInSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const nasaAPI = useMemo(() => new NASAAPIService(), []);

  const loadISSData = useCallback(async () => {
    try {
      setError(null);
      const [locationData, peopleData] = await Promise.all([nasaAPI.getISSLocation(), nasaAPI.getPeopleInSpace()]);

      setIssLocation(locationData);
      setPeopleInSpace(peopleData);
      setLastUpdate(new Date());

      // Check if we're using fallback data and notify user
      const isUsingFallbackLocation = locationData.iss_position?.latitude === "25.4895" && locationData.iss_position?.longitude === "-80.4425";
      const isUsingFallbackPeople = peopleData.people?.some((person) => person.name === "Sergey Prokopyev");

      if (isUsingFallbackLocation || isUsingFallbackPeople) {
        setError("⚠️ Live ISS data temporarily unavailable. Showing simulated data for demonstration purposes.");
      }
    } catch (err) {
      setError("❌ Unable to load ISS data. Please check your internet connection and try again.");
      console.error("ISS Error:", err);
    } finally {
      setLoading(false);
    }
  }, [nasaAPI]);

  useEffect(() => {
    loadISSData();
    const interval = setInterval(loadISSData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [loadISSData]);

  const formatCoordinate = (coord, type) => {
    const direction = type === "lat" ? (coord >= 0 ? "N" : "S") : coord >= 0 ? "E" : "W";
    return `${Math.abs(coord).toFixed(4)}° ${direction}`;
  };

  const calculateSpeed = () => {
    // ISS travels at approximately 27,600 km/h
    return "27,600 km/h";
  };

  const calculateAltitude = () => {
    // ISS orbits at approximately 408 km above Earth
    return "~408 km";
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner size="large" message="Tracking International Space Station..." />
      </Container>
    );
  }

  return (
    <Container className="iss-container">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="iss-header text-center mb-4">
              <h1 className="iss-title text-info">
                <i className="material-icons me-2">satellite</i>
                ISS Live Tracker
              </h1>
              <p className="iss-description text-light">
                Follow the International Space Station in real-time as it orbits Earth at 27,600 km/h, completing one orbit every 90 minutes.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="alert alert-warning" role="alert">
                <i className="material-icons me-2">warning</i>
                {error}
              </div>
            </div>
          </div>
        )}

        {issLocation && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card bg-dark border-info">
                <div className="card-header bg-info text-dark">
                  <h3 className="card-title mb-0">
                    <i className="material-icons me-2">location_on</i>
                    Current ISS Position
                  </h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="location-info">
                        <div className="coordinate-item mb-3">
                          <span className="coordinate-label text-info">Latitude:</span>
                          <span className="coordinate-value text-light fw-bold">{formatCoordinate(parseFloat(issLocation.iss_position.latitude), "lat")}</span>
                        </div>
                        <div className="coordinate-item">
                          <span className="coordinate-label text-info">Longitude:</span>
                          <span className="coordinate-value text-light fw-bold">{formatCoordinate(parseFloat(issLocation.iss_position.longitude), "lng")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="orbital-info">
                        <div className="orbital-item mb-3">
                          <span className="orbital-label text-info">Speed:</span>
                          <span className="orbital-value text-light fw-bold">{calculateSpeed()}</span>
                        </div>
                        <div className="orbital-item">
                          <span className="orbital-label text-info">Altitude:</span>
                          <span className="orbital-value text-light fw-bold">{calculateAltitude()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-12">
                      <div className="last-update text-center">
                        <small className="text-muted">Last updated: {lastUpdate?.toLocaleTimeString() || "Loading..."}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row mb-4">
          <div className="col-12">
            <div className="iss-stats">
              <div className="row">
                <div className="col-lg-3 col-md-6 mb-3">
                  <FlipCard
                    frontTitle="Orbital Speed"
                    frontValue={calculateSpeed()}
                    frontSubtitle="17,500 mph"
                    frontIcon="speed"
                    backTitle="Speed in km/h"
                    backValue="28,000+"
                    backSubtitle="Kilometers per hour"
                    backIcon="speed"
                    color="cyan"
                    size="small"
                  />
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <FlipCard
                    frontTitle="Altitude"
                    frontValue={calculateAltitude()}
                    frontSubtitle="Above Earth"
                    frontIcon="height"
                    backTitle="Distance"
                    backValue="408 km"
                    backSubtitle="Average altitude"
                    backIcon="public"
                    color="orange"
                    size="small"
                  />
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <FlipCard
                    frontTitle="Orbit Period"
                    frontValue="90 min"
                    frontSubtitle="One complete orbit"
                    frontIcon="refresh"
                    backTitle="Earth Views"
                    backValue="16 / Day"
                    backSubtitle="Sunrises & Sunsets"
                    backIcon="wb_sunny"
                    color="green"
                    size="small"
                  />
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <FlipCard
                    frontTitle="Daily Orbits"
                    frontValue="16"
                    frontSubtitle="Orbits per day"
                    frontIcon="loop"
                    backTitle="Mission Duration"
                    backValue="20+ Years"
                    backSubtitle="Continuous presence"
                    backIcon="history"
                    color="purple"
                    size="small"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {peopleInSpace && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card bg-dark border-info">
                <div className="card-header bg-info text-dark">
                  <h3 className="card-title mb-0">
                    <i className="material-icons me-2">group</i>
                    People Currently in Space ({peopleInSpace.number})
                  </h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    {peopleInSpace.people.map((person, index) => (
                      <div key={index} className="col-lg-4 col-md-6 mb-3">
                        <div className="card bg-secondary">
                          <div className="card-body text-center">
                            <i className="material-icons text-info mb-2" style={{ fontSize: "2rem" }}>
                              person
                            </i>
                            <h5 className="card-title text-light">{person.name}</h5>
                            <p className="card-text text-info fw-bold">{person.craft}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-12">
            <div className="card bg-dark border-info">
              <div className="card-header bg-info text-dark">
                <h3 className="card-title mb-0">
                  <i className="material-icons me-2">info</i>
                  ISS Facts
                </h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-4 col-md-6 mb-3">
                    <div className="text-center">
                      <i className="material-icons text-info mb-2" style={{ fontSize: "2rem" }}>
                        timeline
                      </i>
                      <h5 className="text-light">Construction Started</h5>
                      <p className="text-info fw-bold">November 20, 1998</p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 mb-3">
                    <div className="text-center">
                      <i className="material-icons text-info mb-2" style={{ fontSize: "2rem" }}>
                        straighten
                      </i>
                      <h5 className="text-light">Size</h5>
                      <p className="text-info fw-bold">108m × 73m × 20m</p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 mb-3">
                    <div className="text-center">
                      <i className="material-icons text-info mb-2" style={{ fontSize: "2rem" }}>
                        scale
                      </i>
                      <h5 className="text-light">Mass</h5>
                      <p className="text-info fw-bold">~450,000 kg</p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 mb-3">
                    <div className="text-center">
                      <i className="material-icons text-info mb-2" style={{ fontSize: "2rem" }}>
                        power
                      </i>
                      <h5 className="text-light">Solar Array Area</h5>
                      <p className="text-info fw-bold">2,500 m²</p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 mb-3">
                    <div className="text-center">
                      <i className="material-icons text-info mb-2" style={{ fontSize: "2rem" }}>
                        science
                      </i>
                      <h5 className="text-light">Research Conducted</h5>
                      <p className="text-info fw-bold">1000+ experiments</p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 mb-3">
                    <div className="text-center">
                      <i className="material-icons text-info mb-2" style={{ fontSize: "2rem" }}>
                        public
                      </i>
                      <h5 className="text-light">Countries Involved</h5>
                      <p className="text-info fw-bold">15 nations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ISSTrackerComponent;
