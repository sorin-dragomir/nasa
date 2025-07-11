import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Container, LoadingSpinner, ImageGallery, SearchFilter, FlipCard } from "../common";
import NASAAPIService from "../../services/NASAAPIService";
import { useSound } from "../../contexts/SoundContext";
import MarsCharts from "./MarsCharts";
import MarsGallery from "./MarsGallery";
import { mockMarsPhotos, mockRoverData } from "./mockData";
import "./MarsRoverComponent.css";

const MarsRoverComponent = () => {
  const [photos, setPhotos] = useState([]);
  const [roverData, setRoverData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRover, setSelectedRover] = useState("curiosity");
  const [selectedCamera, setSelectedCamera] = useState("");
  const [selectedSol, setSelectedSol] = useState("");
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("charts"); // overview, charts, gallery
  const [usingMockData, setUsingMockData] = useState(false);

  const nasaAPI = useMemo(() => new NASAAPIService(), []);
  const { playSound } = useSound();

  const rovers = [
    { name: "curiosity", label: "Curiosity", active: true },
    { name: "opportunity", label: "Opportunity", active: false },
    { name: "spirit", label: "Spirit", active: false },
    { name: "perseverance", label: "Perseverance", active: true },
    { name: "ingenuity", label: "Ingenuity", active: true },
  ];

  const cameras = {
    curiosity: [
      { value: "", label: "All Cameras" },
      { value: "fhaz", label: "Front Hazard Avoidance Camera" },
      { value: "rhaz", label: "Rear Hazard Avoidance Camera" },
      { value: "mast", label: "Mast Camera" },
      { value: "chemcam", label: "Chemistry and Camera Complex" },
      { value: "mahli", label: "Mars Hand Lens Imager" },
      { value: "mardi", label: "Mars Descent Imager" },
      { value: "navcam", label: "Navigation Camera" },
    ],
    perseverance: [
      { value: "", label: "All Cameras" },
      { value: "edl_rucam", label: "Rover Up-Look Camera" },
      { value: "edl_rdcam", label: "Rover Down-Look Camera" },
      { value: "edl_ddcam", label: "Descent Stage Down-Look Camera" },
      { value: "edl_pucam1", label: "Parachute Up-Look Camera A" },
      { value: "edl_pucam2", label: "Parachute Up-Look Camera B" },
      { value: "navcam_left", label: "Navigation Camera - Left" },
      { value: "navcam_right", label: "Navigation Camera - Right" },
      { value: "mcz_right", label: "Mast Camera Zoom - Right" },
      { value: "mcz_left", label: "Mast Camera Zoom - Left" },
      { value: "front_hazcam_left_a", label: "Front Hazard Avoidance Camera - Left" },
      { value: "front_hazcam_right_a", label: "Front Hazard Avoidance Camera - Right" },
      { value: "rear_hazcam_left", label: "Rear Hazard Avoidance Camera - Left" },
      { value: "rear_hazcam_right", label: "Rear Hazard Avoidance Camera - Right" },
    ],
    opportunity: [
      { value: "", label: "All Cameras" },
      { value: "fhaz", label: "Front Hazard Avoidance Camera" },
      { value: "rhaz", label: "Rear Hazard Avoidance Camera" },
      { value: "navcam", label: "Navigation Camera" },
      { value: "pancam", label: "Panoramic Camera" },
      { value: "minites", label: "Miniature Thermal Emission Spectrometer" },
    ],
    spirit: [
      { value: "", label: "All Cameras" },
      { value: "fhaz", label: "Front Hazard Avoidance Camera" },
      { value: "rhaz", label: "Rear Hazard Avoidance Camera" },
      { value: "navcam", label: "Navigation Camera" },
      { value: "pancam", label: "Panoramic Camera" },
      { value: "minites", label: "Miniature Thermal Emission Spectrometer" },
    ],
  };

  // loadRoverData and loadRecentPhotos functions moved inline to useEffect

  const loadRoverData = useCallback(async () => {
    try {
      setUsingMockData(false);
      const manifest = await nasaAPI.getMarsRoverManifest(selectedRover);
      setRoverData(manifest.rover);
      return manifest.rover;
    } catch (err) {
      console.error("Rover manifest error:", err);
      console.log("Falling back to mock rover data");
      setUsingMockData(true);
      setRoverData(mockRoverData);
      return mockRoverData;
    }
  }, [selectedRover, nasaAPI]);

  const loadRecentPhotos = useCallback(
    async (roverInfo) => {
      try {
        setLoading(true);
        setError(null);

        if (usingMockData) {
          console.log("Using mock Mars photos data");
          setPhotos(mockMarsPhotos);
          return;
        }

        const response = await nasaAPI.getMarsRoverPhotos(selectedRover, roverInfo?.max_sol || 1000, null, selectedCamera);

        setPhotos(response.photos || []);
      } catch (err) {
        console.error("Mars photos error:", err);
        console.log("Falling back to mock Mars photos");
        setUsingMockData(true);
        setPhotos(mockMarsPhotos);
        setError("Using sample data - NASA API temporarily unavailable");
      } finally {
        setLoading(false);
      }
    },
    [selectedRover, selectedCamera, nasaAPI, usingMockData]
  );

  useEffect(() => {
    const loadInitialData = async () => {
      // Always load mock data first for immediate chart display
      console.log("Loading initial Mars data...");
      setPhotos(mockMarsPhotos);
      setRoverData(mockRoverData);
      setUsingMockData(true);
      setLoading(false);
      
      // Then try to load real data
      try {
        const roverInfo = await loadRoverData();
        if (roverInfo && !usingMockData) {
          await loadRecentPhotos(roverInfo);
        }
      } catch (err) {
        console.log("Staying with mock data due to API error");
      }
    };

    loadInitialData();
  }, [loadRoverData, loadRecentPhotos, usingMockData]);

  const handleSearch = async (query, filters) => {
    try {
      setLoading(true);
      setError(null);

      if (usingMockData) {
        console.log("Search with mock data not implemented");
        setPhotos(mockMarsPhotos);
        return;
      }

      let sol = selectedSol;
      let earthDate = null;

      if (filters.startDate) {
        earthDate = filters.startDate;
        sol = null;
      }

      const response = await nasaAPI.getMarsRoverPhotos(selectedRover, sol, earthDate, selectedCamera);

      setPhotos(response.photos || []);
    } catch (err) {
      console.error("Mars search error:", err);
      console.log("Search failed, falling back to mock data");
      setUsingMockData(true);
      setPhotos(mockMarsPhotos);
      setError("Search failed - using sample data");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    // Handle filter changes from gallery component
    console.log('Filter change:', filters);
  };

  const handleGalleryFilterChange = useCallback((newFilters) => {
    // Apply filters and trigger data reload if needed
    if (newFilters.camera && newFilters.camera !== selectedCamera) {
      setSelectedCamera(newFilters.camera);
    }
    if (newFilters.sol && newFilters.sol !== selectedSol) {
      setSelectedSol(newFilters.sol.toString());
    }
  }, [selectedCamera, selectedSol]);

  const formatImageForGallery = (photo) => ({
    url: photo.img_src,
    title: `${photo.camera.full_name} - Sol ${photo.sol}`,
    date: photo.earth_date,
    alt: `Mars photo from ${photo.camera.full_name}`,
    camera: photo.camera.name,
    sol: photo.sol,
    rover: photo.rover.name,
  });

  if (loading && photos.length === 0) {
    return (
      <Container>
        <LoadingSpinner size="large" message="Loading Mars rover photos..." />
      </Container>
    );
  }

  return (
    <Container className="mars-rover-container">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="mars-header text-center mb-4">
              <h1 className="mars-title text-danger">
                <i className="material-icons me-2">terrain</i>
                Mars Rover Photos
              </h1>
              <p className="mars-description text-light">
                Explore the Red Planet through the eyes of NASA's Mars rovers. View stunning images captured by various cameras aboard these robotic explorers.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="alert alert-warning" role="alert">
                <div className="d-flex align-items-center">
                  <i className="material-icons me-2">warning</i>
                  <div>{error}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {usingMockData && !error && (
          <div className="row mb-2">
            <div className="col-12">
              <div className="alert alert-info" role="alert" style={{padding: '8px 12px', fontSize: '0.85rem', marginBottom: '0.5rem'}}>
                <small>
                  <i className="material-icons me-1" style={{fontSize: '1rem', verticalAlign: 'middle'}}>info</i>
                  Demo mode • {photos.length} photos • {roverData?.name} rover
                </small>
              </div>
            </div>
          </div>
        )}

        {roverData && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="rover-stats">
                <div className="row">
                  <div className="col-lg-3 col-md-6 mb-3">
                    <FlipCard
                      frontTitle="Mission Status"
                      frontValue={roverData.status === "active" ? "Active" : "Complete"}
                      frontSubtitle={`Landing: ${roverData.landing_date}`}
                      frontIcon={roverData.status === "active" ? "radio_button_checked" : "check_circle"}
                      backTitle="Launch Date"
                      backValue={roverData.launch_date}
                      backSubtitle="Earth departure"
                      backIcon="rocket_launch"
                      color={roverData.status === "active" ? "green" : "orange"}
                      size="small"
                    />
                  </div>
                  <div className="col-lg-3 col-md-6 mb-3">
                    <FlipCard
                      frontTitle="Sol Days"
                      frontValue={roverData.max_sol?.toLocaleString()}
                      frontSubtitle="Martian Days Operated"
                      frontIcon="wb_sunny"
                      backTitle="Earth Days"
                      backValue={Math.round(roverData.max_sol * 1.027).toLocaleString()}
                      backSubtitle="Earth equivalent"
                      backIcon="public"
                      color="cyan"
                      size="small"
                    />
                  </div>
                  <div className="col-lg-3 col-md-6 mb-3">
                    <FlipCard
                      frontTitle="Total Photos"
                      frontValue={roverData.total_photos?.toLocaleString()}
                      frontSubtitle="Images Captured"
                      frontIcon="photo_camera"
                      backTitle="Daily Average"
                      backValue={Math.round(roverData.total_photos / roverData.max_sol)}
                      backSubtitle="Photos per Sol"
                      backIcon="camera_alt"
                      color="purple"
                      size="small"
                    />
                  </div>
                  <div className="col-lg-3 col-md-6 mb-3">
                    <FlipCard
                      frontTitle="Last Photo"
                      frontValue={roverData.max_date}
                      frontSubtitle="Most Recent Activity"
                      frontIcon="schedule"
                      backTitle="Mission Length"
                      backValue={`${Math.round(roverData.max_sol / 687)} Years`}
                      backSubtitle="Martian years"
                      backIcon="history"
                      color="red"
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
            <div className="card bg-dark" style={{borderColor: 'rgb(8, 17, 28)'}}>
              <div className="card-header text-white" style={{backgroundColor: 'rgb(8, 17, 28)'}}>
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="card-title mb-0">
                    <i className="material-icons me-2">settings</i>
                    Rover Controls
                  </h3>
                  <div className="btn-group" role="group" aria-label="View tabs">
                    <button
                      className={`btn ${activeTab === "overview" ? "btn-light" : "btn-outline-light"} btn-sm`}
                      onClick={() => {
                        playSound("click");
                        setActiveTab("overview");
                      }}
                    >
                      <i className="material-icons me-1">dashboard</i>
                      Overview
                    </button>
                    <button
                      className={`btn ${activeTab === "charts" ? "btn-light" : "btn-outline-light"} btn-sm`}
                      onClick={() => {
                        playSound("click");
                        setActiveTab("charts");
                      }}
                    >
                      <i className="material-icons me-1">bar_chart</i>
                      Charts
                    </button>
                    <button
                      className={`btn ${activeTab === "gallery" ? "btn-light" : "btn-outline-light"} btn-sm`}
                      onClick={() => {
                        playSound("click");
                        setActiveTab("gallery");
                      }}
                    >
                      <i className="material-icons me-1">photo_library</i>
                      Gallery
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 mb-3">
                    <label className="form-label text-info">Choose Rover:</label>
                    <div className="btn-group-vertical btn-group-toggle d-md-none" data-bs-toggle="buttons">
                      {rovers.map((rover) => (
                        <button
                          key={rover.name}
                          className={`btn ${selectedRover === rover.name ? "text-white" : "text-light"} ${!rover.active ? "disabled" : ""}`}
                          style={{
                            backgroundColor: selectedRover === rover.name ? 'rgb(8, 17, 28)' : 'transparent',
                            borderColor: 'rgb(8, 17, 28)',
                            border: '1px solid rgb(8, 17, 28)'
                          }}
                          onClick={() => {
                            playSound("click");
                            setSelectedRover(rover.name);
                          }}
                          disabled={!rover.active}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold">{rover.label}</span>
                            <small className="text-muted">{rover.active ? "Active" : "Mission Complete"}</small>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="btn-group d-none d-md-flex" role="group" aria-label="Rover selection">
                      {rovers.map((rover) => (
                        <button
                          key={rover.name}
                          className={`btn ${selectedRover === rover.name ? "text-white" : "text-light"} ${!rover.active ? "disabled" : ""}`}
                          style={{
                            backgroundColor: selectedRover === rover.name ? 'rgb(8, 17, 28)' : 'transparent',
                            borderColor: 'rgb(8, 17, 28)',
                            border: '1px solid rgb(8, 17, 28)'
                          }}
                          onClick={() => {
                            playSound("click");
                            setSelectedRover(rover.name);
                          }}
                          disabled={!rover.active}
                        >
                          <div className="text-center">
                            <div className="fw-bold">{rover.label}</div>
                            <small className="text-muted">{rover.active ? "Active" : "Mission Complete"}</small>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="camera-select" className="form-label text-info">
                      Camera:
                    </label>
                    <select
                      id="camera-select"
                      value={selectedCamera}
                      onChange={(e) => {
                        playSound("click");
                        setSelectedCamera(e.target.value);
                      }}
                      className="form-select bg-dark text-light border-secondary"
                    >
                      {(cameras[selectedRover] || cameras.curiosity).map((camera) => (
                        <option key={camera.value} value={camera.value}>
                          {camera.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="sol-input" className="form-label text-info">
                      Sol (Martian Day):
                    </label>
                    <input
                      id="sol-input"
                      type="number"
                      value={selectedSol}
                      onChange={(e) => {
                        playSound("click");
                        setSelectedSol(e.target.value);
                      }}
                      placeholder="Latest"
                      min="0"
                      max={roverData?.max_sol}
                      className="form-control bg-dark text-light border-secondary"
                    />
                  </div>
                  <div className="col-md-4 mb-3 d-flex align-items-end">
                    <button
                      className="btn text-white w-100"
                      style={{
                        backgroundColor: 'rgb(8, 17, 28)',
                        borderColor: 'rgb(8, 17, 28)',
                        border: '1px solid rgb(8, 17, 28)'
                      }}
                      onClick={() => {
                        playSound("click");
                        handleSearch("", {});
                      }}
                      disabled={loading}
                    >
                      <i className="material-icons me-2">search</i>
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {activeTab === "overview" && (
          <>
            <div className="row mb-4">
              <div className="col-12">
                <SearchFilter
                  onSearch={handleSearch}
                  onFilterChange={handleFilterChange}
                  loading={loading}
                  placeholder="Search Mars rover photos by sol, date, or camera..."
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <ImageGallery
                  images={photos.map(formatImageForGallery)}
                  title={`${selectedRover.charAt(0).toUpperCase() + selectedRover.slice(1)} Rover Photos`}
                  loading={loading}
                />
              </div>
            </div>

            {photos.length === 0 && !loading && (
              <div className="row">
                <div className="col-12">
                  <div className="text-center py-5">
                    <i className="material-icons text-muted mb-3" style={{ fontSize: "3rem" }}>
                      photo_library
                    </i>
                    <h3 className="text-light">No photos found</h3>
                    <p className="text-muted">Try adjusting your search parameters or selecting a different date/sol.</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "charts" && (
          <>
            <div className="row">
              <div className="col-12">
                {console.log("Rendering MarsCharts with photos:", photos.length)}
                <MarsCharts 
                  photos={photos} 
                  roverData={roverData} 
                  selectedRover={selectedRover}
                />
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-12">
                <div className="card bg-dark" style={{borderColor: 'rgb(8, 17, 28)'}}>
                  <div className="card-header text-white" style={{backgroundColor: 'rgb(8, 17, 28)'}}>
                    <h3 className="card-title mb-0">
                      <i className="material-icons me-2">photo_library</i>
                      Recent Photos
                    </h3>
                  </div>
                  <div className="card-body">
                    <ImageGallery
                      images={photos.map(formatImageForGallery)}
                      title={`${selectedRover.charAt(0).toUpperCase() + selectedRover.slice(1)} Rover Photos`}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {photos.length === 0 && !loading && (
              <div className="row mt-4">
                <div className="col-12">
                  <div className="text-center py-5">
                    <i className="material-icons text-muted mb-3" style={{ fontSize: "3rem" }}>
                      photo_library
                    </i>
                    <h3 className="text-light">No photos found</h3>
                    <p className="text-muted">Try adjusting your search parameters or selecting a different date/sol.</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "gallery" && (
          <div className="row">
            <div className="col-12">
              <MarsGallery 
                photos={photos}
                selectedRover={selectedRover}
                selectedCamera={selectedCamera}
                onFilterChange={handleGalleryFilterChange}
              />
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default MarsRoverComponent;
