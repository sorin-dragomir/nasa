import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Container, LoadingSpinner, SearchFilter, FlipCard } from "../common";
import NASAAPIService from "../../services/NASAAPIService";
import { useSound } from "../../contexts/SoundContext";
import NeoCharts from "./NeoCharts";
import NeoChartsChartJS from "./NeoChartsChartJS";
import NeoChartsD3 from "./NeoChartsD3";
import { mockNeoData, mockAsteroids } from "./mockData";
import "./NearEarthObjectsComponent.css";

const NearEarthObjectsComponent = () => {
  const [neoData, setNeoData] = useState(null);
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [chartLibrary, setChartLibrary] = useState('recharts'); // 'recharts', 'chartjs', 'd3'
  // const [selectedAsteroid, setSelectedAsteroid] = useState(null); // Commented out for now

  const nasaAPI = useMemo(() => new NASAAPIService(), []);
  const { playSound } = useSound();

  const loadNearEarthObjects = useCallback(
    async (startDate = null, endDate = null) => {
      try {
        setLoading(true);
        setError(null);

        const start = startDate || selectedDate;
        const end = endDate || selectedDate;

        let data;
        try {
          data = await nasaAPI.getNearEarthObjects(start, end);
        } catch (apiError) {
          console.warn("NASA API failed, using mock data:", apiError);
          // Use mock data as fallback
          data = mockNeoData;
          setError("Using demo data - NASA API temporarily unavailable");
        }

        setNeoData(data);

        // Flatten asteroids from all dates
        const allAsteroids = [];
        Object.keys(data.near_earth_objects).forEach((date) => {
          data.near_earth_objects[date].forEach((asteroid) => {
            allAsteroids.push({ ...asteroid, approach_date: date });
          });
        });

        // If no asteroids from API, use mock asteroids
        if (allAsteroids.length === 0) {
          setAsteroids(mockAsteroids);
        } else {
          // Sort by closest approach distance
          allAsteroids.sort((a, b) => {
            const distA = parseFloat(a.close_approach_data[0]?.miss_distance?.kilometers || 0);
            const distB = parseFloat(b.close_approach_data[0]?.miss_distance?.kilometers || 0);
            return distA - distB;
          });
          setAsteroids(allAsteroids);
        }
      } catch (err) {
        console.error("NEO Error:", err);
        // Fallback to mock data
        setNeoData(mockNeoData);
        setAsteroids(mockAsteroids);
        setError("Using demo data - Unable to load live NASA data");
      } finally {
        setLoading(false);
      }
    },
    [selectedDate, nasaAPI]
  );

  useEffect(() => {
    loadNearEarthObjects();
  }, [loadNearEarthObjects]);

  const handleSearch = (query, filters) => {
    if (filters.startDate && filters.endDate) {
      loadNearEarthObjects(filters.startDate, filters.endDate);
    }
  };

  const handleFilterChange = (filters) => {
    // Handle filter changes
  };

  const loadAsteroidDetails = async (asteroidId) => {
    try {
      const details = await nasaAPI.getNearEarthObjectById(asteroidId);
      console.log("Asteroid details:", details); // For future use
      // setSelectedAsteroid(details); // Uncomment when implementing modal
    } catch (err) {
      console.error("Asteroid details error:", err);
    }
  };

  const formatDistance = (kilometers) => {
    const km = parseFloat(kilometers);
    if (km > 1000000) {
      return `${(km / 1000000).toFixed(2)} million km`;
    } else if (km > 1000) {
      return `${(km / 1000).toFixed(0)} thousand km`;
    }
    return `${km.toFixed(0)} km`;
  };

  const formatDiameter = (min, max) => {
    const avgKm = (min + max) / 2;
    if (avgKm > 1) {
      return `~${avgKm.toFixed(1)} km`;
    }
    return `~${(avgKm * 1000).toFixed(0)} m`;
  };

  const getRiskLevel = (asteroid) => {
    const distance = parseFloat(asteroid.close_approach_data[0]?.miss_distance?.kilometers || 0);
    const diameter = asteroid.estimated_diameter?.kilometers?.estimated_diameter_max || 0;

    if (asteroid.is_potentially_hazardous_asteroid) {
      return { level: "High", color: "red" };
    } else if (distance < 1000000 && diameter > 0.1) {
      return { level: "Medium", color: "orange" };
    }
    return { level: "Low", color: "green" };
  };

  if (loading && !neoData) {
    return (
      <Container>
        <LoadingSpinner size="large" message="Loading Near Earth Objects..." />
      </Container>
    );
  }

  return (
    <Container className="neo-container">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="neo-header text-center mb-4">
              <h1 className="neo-title text-warning">
                <i className="material-icons me-2">public</i>
                Near Earth Objects
              </h1>
              <p className="neo-description text-light">
                Track asteroids and comets that pass close to Earth's orbit. Monitor potentially hazardous objects and learn about these cosmic visitors.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="alert alert-danger" role="alert">
                <i className="material-icons me-2">error</i>
                {error}
              </div>
            </div>
          </div>
        )}

        {neoData && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="neo-stats">
                <div className="row">
                  <div className="col-lg-3 col-md-6 mb-3">
                    <FlipCard
                      frontTitle="Objects Today"
                      frontValue={neoData.element_count}
                      frontSubtitle={`Date: ${selectedDate}`}
                      frontIcon="track_changes"
                      backTitle="Weekly Average"
                      backValue="~150"
                      backSubtitle="NEOs per week"
                      backIcon="analytics"
                      color="cyan"
                      size="small"
                    />
                  </div>
                  <div className="col-lg-3 col-md-6 mb-3">
                    <FlipCard
                      frontTitle="Closest Approach"
                      frontValue={asteroids.length > 0 ? formatDistance(asteroids[0].close_approach_data[0]?.miss_distance?.kilometers) : "N/A"}
                      frontSubtitle="Nearest object distance"
                      frontIcon="my_location"
                      backTitle="Safe Distance"
                      backValue="7.5M km"
                      backSubtitle="Moon's distance x20"
                      backIcon="shield"
                      color="orange"
                      size="small"
                    />
                  </div>
                  <div className="col-lg-3 col-md-6 mb-3">
                    <FlipCard
                      frontTitle="Hazardous Objects"
                      frontValue={asteroids.filter((a) => a.is_potentially_hazardous_asteroid).length}
                      frontSubtitle="Potentially dangerous"
                      frontIcon="warning"
                      backTitle="Total Known PHAs"
                      backValue="2,300+"
                      backSubtitle="Catalogued threats"
                      backIcon="security"
                      color="red"
                      size="small"
                    />
                  </div>
                  <div className="col-lg-3 col-md-6 mb-3">
                    <FlipCard
                      frontTitle="Largest Object"
                      frontValue={
                        asteroids.length > 0
                          ? formatDiameter(
                              asteroids.reduce((max, a) => Math.max(max, a.estimated_diameter?.kilometers?.estimated_diameter_max || 0), 0),
                              asteroids.reduce((max, a) => Math.max(max, a.estimated_diameter?.kilometers?.estimated_diameter_max || 0), 0)
                            )
                          : "N/A"
                      }
                      frontSubtitle="Estimated diameter"
                      frontIcon="straighten"
                      backTitle="Detection Rate"
                      backValue="30 / Night"
                      backSubtitle="New discoveries"
                      backIcon="search"
                      color="purple"
                      size="small"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row mb-4">
          <div className="col-12">
            <SearchFilter
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              loading={loading}
              placeholder="Search for Near Earth Objects by date or 'today'..."
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="row mb-4">
          <div className="col-12">
            {/* Debug Info */}
            <div className="debug-info mb-3" style={{ 
              background: 'rgba(255, 255, 0, 0.1)', 
              padding: '10px', 
              borderRadius: '4px',
              fontSize: '12px',
              color: '#ffff00'
            }}>
              <strong>Debug Info:</strong> 
              neoData: {neoData ? 'Loaded' : 'Not loaded'} | 
              asteroids: {asteroids.length} items | 
              loading: {loading ? 'Yes' : 'No'} | 
              error: {error || 'None'}
            </div>

            {/* Chart Library Selector - Always show */}
            <div className="chart-selector mb-4">
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button 
                  className={`btn ${chartLibrary === 'recharts' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => {
                    setChartLibrary('recharts');
                    playSound('click');
                  }}
                >
                  <i className="material-icons me-2">analytics</i>
                  Recharts
                </button>
                <button 
                  className={`btn ${chartLibrary === 'chartjs' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => {
                    setChartLibrary('chartjs');
                    playSound('click');
                  }}
                >
                  <i className="material-icons me-2">bar_chart</i>
                  Chart.js
                </button>
                <button 
                  className={`btn ${chartLibrary === 'd3' ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => {
                    setChartLibrary('d3');
                    playSound('click');
                  }}
                >
                  <i className="material-icons me-2">scatter_plot</i>
                  D3.js
                </button>
              </div>
            </div>

            {/* Render Selected Chart Library - Show even with no data */}
            {chartLibrary === 'recharts' && (
              <NeoCharts neoData={neoData} asteroids={asteroids} />
            )}
            {chartLibrary === 'chartjs' && (
              <NeoChartsChartJS neoData={neoData} asteroids={asteroids} />
            )}
            {chartLibrary === 'd3' && (
              <NeoChartsD3 neoData={neoData} asteroids={asteroids} />
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card bg-dark border-warning">
              <div className="card-header bg-warning text-dark">
                <h2 className="card-title mb-0">
                  <i className="material-icons me-2">format_list_bulleted</i>
                  Asteroid Encounters
                </h2>
              </div>
              <div className="card-body">
                <div className="row">
                  {asteroids.map((asteroid, index) => {
                    const closeApproach = asteroid.close_approach_data[0];
                    const risk = getRiskLevel(asteroid);

                    return (
                      <div key={asteroid.id} className="col-xl-6 col-lg-12 mb-4">
                        <div
                          className={`card bg-secondary border-${
                            risk.color === "red" ? "danger" : risk.color === "orange" ? "warning" : "success"
                          } h-100 asteroid-card`}
                          onClick={() => {
                            playSound("click");
                            loadAsteroidDetails(asteroid.id);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="card-header d-flex justify-content-between align-items-center">
                            <div className="asteroid-name">
                              <h5 className="card-title text-light mb-0">{asteroid.name}</h5>
                              <small className="text-muted">#{asteroid.id}</small>
                            </div>
                            <div
                              className={`badge bg-${
                                risk.color === "red" ? "danger" : risk.color === "orange" ? "warning" : "success"
                              } d-flex align-items-center`}
                            >
                              <i className="material-icons me-1" style={{ fontSize: "1rem" }}>
                                {risk.level === "High" ? "warning" : risk.level === "Medium" ? "info" : "check_circle"}
                              </i>
                              {risk.level} Risk
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-6 mb-3">
                                <div className="d-flex align-items-center">
                                  <i className="material-icons text-warning me-2">straighten</i>
                                  <div>
                                    <div className="text-muted small">Estimated Diameter</div>
                                    <div className="text-light fw-bold">
                                      {formatDiameter(
                                        asteroid.estimated_diameter?.kilometers?.estimated_diameter_min || 0,
                                        asteroid.estimated_diameter?.kilometers?.estimated_diameter_max || 0
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6 mb-3">
                                <div className="d-flex align-items-center">
                                  <i className="material-icons text-info me-2">speed</i>
                                  <div>
                                    <div className="text-muted small">Velocity</div>
                                    <div className="text-light fw-bold">
                                      {parseFloat(closeApproach?.relative_velocity?.kilometers_per_hour || 0).toLocaleString()} km/h
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6 mb-3">
                                <div className="d-flex align-items-center">
                                  <i className="material-icons text-success me-2">my_location</i>
                                  <div>
                                    <div className="text-muted small">Miss Distance</div>
                                    <div className="text-light fw-bold">{formatDistance(closeApproach?.miss_distance?.kilometers)}</div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6 mb-3">
                                <div className="d-flex align-items-center">
                                  <i className="material-icons text-secondary me-2">schedule</i>
                                  <div>
                                    <div className="text-muted small">Close Approach</div>
                                    <div className="text-light fw-bold">{new Date(closeApproach?.close_approach_date_full).toLocaleDateString()}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {asteroid.is_potentially_hazardous_asteroid && (
                              <div className="alert alert-danger py-2 mt-3 mb-0">
                                <i className="material-icons me-2">warning</i>
                                Potentially Hazardous Asteroid
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {asteroids.length === 0 && !loading && (
          <div className="row">
            <div className="col-12">
              <div className="text-center py-5">
                <i className="material-icons text-muted mb-3" style={{ fontSize: "3rem" }}>
                  search_off
                </i>
                <h3 className="text-light">No asteroids found</h3>
                <p className="text-muted">Try selecting a different date range to find asteroid encounters.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default NearEarthObjectsComponent;
