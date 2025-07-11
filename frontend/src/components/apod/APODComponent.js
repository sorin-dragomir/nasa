import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Container, LoadingSpinner, ImageGallery, SearchFilter, FlipCard } from "../common";
import { useSound } from "../../contexts/SoundContext";
import NASAAPIService from "../../services/NASAAPIService";
import "./APODComponent.css";

const APODComponent = () => {
  const [apodData, setApodData] = useState(null);
  const [apodHistory, setApodHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [viewMode, setViewMode] = useState("today"); // 'today', 'history', 'random'
  const { playSound } = useSound();

  const nasaAPI = useMemo(() => new NASAAPIService(), []);

  const loadTodayAPOD = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await nasaAPI.getAPOD();
      setApodData(data);
    } catch (err) {
      setError("Failed to load today's Astronomy Picture. Please try again later.");
      console.error("APOD Error:", err);
    } finally {
      setLoading(false);
    }
  }, [nasaAPI]);

  useEffect(() => {
    loadTodayAPOD();
  }, [loadTodayAPOD]);

  const loadSpecificDate = async (date) => {
    try {
      setLoading(true);
      setError(null);
      const data = await nasaAPI.getAPOD(date);
      setApodData(data);
      setSelectedDate(date);
    } catch (err) {
      setError("Failed to load picture for selected date. Please try another date.");
      console.error("APOD Date Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadRandomAPODs = async () => {
    try {
      setHistoryLoading(true);
      setError(null);
      const data = await nasaAPI.getAPOD(null, 12); // Get 12 random images
      setApodHistory(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError("Failed to load random pictures. Please try again.");
      console.error("APOD Random Error:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSearch = (query, filters) => {
    // Clear any previous errors and results
    setError(null);
    setApodHistory([]);

    // Handle random search
    if (query && query.toLowerCase().includes("random")) {
      loadRandomAPODs();
      setViewMode("random");
      return;
    }

    // Handle empty search
    if (!query || !query.trim()) {
      setError("Please enter a search term. Type 'random' for random images.");
      return;
    }

    // For any other query, show random results for now
    // (In a real implementation, this could search titles/descriptions)
    loadRandomAPODs();
    setViewMode("random");
  };

  const handleFilterChange = (filters) => {
    // Handle filter changes if needed
  };

  const formatImageForGallery = (apodItem) => ({
    url: apodItem.url,
    hdurl: apodItem.hdurl,
    title: apodItem.title,
    date: apodItem.date,
    explanation: apodItem.explanation,
    copyright: apodItem.copyright,
  });

  if (loading && !apodData) {
    return (
      <Container>
        <LoadingSpinner size="large" message="Loading Astronomy Picture of the Day..." />
      </Container>
    );
  }

  return (
    <Container className="apod-container">
      <div className="apod-header">
        <h1 className="apod-title">
          <i className="material-icons">photo_camera</i>
          Astronomy Picture of the Day
        </h1>
        <p className="apod-description">Discover the cosmos! Each day NASA features a different image or photograph of our fascinating universe.</p>
      </div>

      {error && (
        <div className="error-message">
          <i className="material-icons">error</i>
          {error}
        </div>
      )}

      <div className="apod-stats">
        <div className="row">
          <div className="col-lg-3 col-md-6 mb-3">
            <FlipCard
              frontTitle="Today's Featured"
              frontValue={apodData?.media_type === "image" ? "Image" : "Video"}
              frontIcon="today"
              backTitle="Media Distribution"
              backValue="85%"
              backSubtitle="Images vs Videos"
              backIcon="pie_chart"
              color="cyan"
              size="small"
            />
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <FlipCard
              frontTitle="Available Since"
              frontValue="1995"
              frontSubtitle="June 16, 1995"
              frontIcon="history"
              backTitle="Days Active"
              backValue="10,950+"
              backSubtitle="Days of Wonder"
              backIcon="calendar_today"
              color="orange"
              size="small"
            />
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <FlipCard
              frontTitle="Total Archive"
              frontValue="9,000+"
              frontSubtitle="Images & Videos"
              frontIcon="photo_library"
              backTitle="Growth Rate"
              backValue="1 / Day"
              backSubtitle="New Content"
              backIcon="trending_up"
              color="green"
              size="small"
            />
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <FlipCard
              frontTitle="Data Source"
              frontValue="NASA API"
              frontSubtitle="Official Archive"
              frontIcon="cloud"
              backTitle="Update Time"
              backValue="Daily"
              backSubtitle="12:00 UTC"
              backIcon="schedule"
              color="purple"
              size="small"
            />
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12">
            <div className="card bg-dark border-info">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-lg-6 col-md-12 mb-3 mb-lg-0">
                    <div className="btn-group w-100" role="group" aria-label="View modes">
                      <button
                        type="button"
                        className={`btn ${viewMode === "today" ? "btn-info" : "btn-outline-info"}`}
                        onClick={() => {
                          playSound("click");
                          setViewMode("today");
                          loadTodayAPOD();
                        }}
                      >
                        <i className="material-icons me-2">today</i>
                        Today
                      </button>
                      <button
                        type="button"
                        className={`btn ${viewMode === "history" ? "btn-info" : "btn-outline-info"}`}
                        onClick={() => {
                          playSound("click");
                          setViewMode("history");
                        }}
                      >
                        <i className="material-icons me-2">history</i>
                        History
                      </button>
                      <button
                        type="button"
                        className={`btn ${viewMode === "random" ? "btn-info" : "btn-outline-info"}`}
                        onClick={() => {
                          playSound("click");
                          setViewMode("random");
                          loadRandomAPODs();
                        }}
                      >
                        <i className="material-icons me-2">shuffle</i>
                        Random
                      </button>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <div className="d-flex align-items-center justify-content-lg-end flex-wrap">
                      <label htmlFor="apod-date" className="form-label me-2 mb-0 text-info flex-shrink-0">
                        Select Date:
                      </label>
                      <div className="d-flex align-items-center">
                        <input
                          id="apod-date"
                          type="date"
                          className="form-control form-control-sm me-2"
                          style={{ maxWidth: "150px", backgroundColor: "rgba(0,0,0,0.8)", borderColor: "#00ffff", color: "#00ffff" }}
                          value={selectedDate}
                          onChange={(e) => {
                            playSound("click");
                            setSelectedDate(e.target.value);
                          }}
                          max={new Date().toISOString().split("T")[0]}
                          min="1995-06-16"
                        />
                        <button
                          className="btn btn-outline-info btn-sm flex-shrink-0"
                          onClick={() => {
                            playSound("click");
                            loadSpecificDate(selectedDate);
                            setViewMode("today");
                          }}
                          disabled={loading}
                          title="Search for this date"
                        >
                          <i className="material-icons">search</i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {viewMode === "today" && apodData && (
        <div className="apod-featured">
          <div className="featured-image">
            {apodData.media_type === "image" ? (
              <img src={apodData.url} alt={apodData.title} onClick={() => window.open(apodData.hdurl || apodData.url, "_blank")} />
            ) : (
              <div className="video-container">
                <iframe src={apodData.url} title={apodData.title} frameBorder="0" allowFullScreen />
              </div>
            )}
          </div>

          <div className="featured-info">
            <h2 className="featured-title">{apodData.title}</h2>
            <p className="featured-date">{apodData.date}</p>
            <p className="featured-explanation">{apodData.explanation}</p>
            {apodData.copyright && <p className="featured-copyright">© {apodData.copyright}</p>}

            <div className="featured-actions">
              {apodData.hdurl && (
                <a href={apodData.hdurl} target="_blank" rel="noopener noreferrer" className="action-btn">
                  <i className="material-icons">hd</i>
                  View HD
                </a>
              )}
              <button
                className="action-btn"
                onClick={() =>
                  navigator.share?.({
                    title: apodData.title,
                    text: apodData.explanation,
                    url: window.location.href,
                  })
                }
              >
                <i className="material-icons">share</i>
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {(viewMode === "history" || viewMode === "random") && (
        <div className="apod-gallery-section">
          <div className="search-instructions">
            <h3>Search APOD Archive</h3>
            <p>
              • Type <strong>"random"</strong> in the search box and click <strong>"Search"</strong> for random images
              <br />• Simple search functionality - enter keywords or "random" to explore the archive
              <br />• Use the date picker above for specific dates
            </p>
          </div>

          <SearchFilter
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            loading={historyLoading}
            placeholder="Type 'random' for random images or search terms"
          />

          <ImageGallery
            images={apodHistory.map(formatImageForGallery)}
            title={viewMode === "random" ? "Random APOD Collection" : "APOD History"}
            loading={historyLoading}
          />
        </div>
      )}
    </Container>
  );
};

export default APODComponent;
