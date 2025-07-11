import React, { useState, useMemo, useCallback } from 'react';
import { useSound } from '../../contexts/SoundContext';
import './MarsGallery.css';

const MarsGallery = ({ photos, selectedRover, selectedCamera, onFilterChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [filters, setFilters] = useState({
    camera: '',
    sol: '',
    dateRange: '',
    sortBy: 'latest'
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  const { playSound } = useSound();
  const photosPerPage = 24;

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    if (!photos || photos.length === 0) return { cameras: [], sols: [], dateRange: [] };
    
    // Get unique cameras by creating a Map to avoid duplicates, only include cameras with photos
    const cameraMap = new Map();
    photos.forEach(p => {
      const key = `${p.camera.name}-${p.camera.full_name}`;
      if (!cameraMap.has(key)) {
        cameraMap.set(key, {
          value: p.camera.name,
          label: p.camera.full_name,
          count: 0
        });
      }
      cameraMap.get(key).count++;
    });
    
    // Only include cameras that have photos
    const cameras = Array.from(cameraMap.values()).filter(camera => camera.count > 0);
    
    const sols = [...new Set(photos.map(p => p.sol))].sort((a, b) => b - a);
    const dates = [...new Set(photos.map(p => p.earth_date))].sort();
    
    return {
      cameras: [{ value: '', label: 'All Cameras' }, ...cameras],
      sols: sols.slice(0, 20), // Show latest 20 sols
      dateRange: { min: dates[0], max: dates[dates.length - 1] }
    };
  }, [photos]);

  // Filter and sort photos
  const filteredPhotos = useMemo(() => {
    if (!photos) return [];
    
    let filtered = photos.filter(photo => {
      if (filters.camera && photo.camera.name !== filters.camera) return false;
      if (filters.sol && photo.sol !== parseInt(filters.sol)) return false;
      return true;
    });

    // Sort photos
    switch (filters.sortBy) {
      case 'latest':
        filtered = filtered.sort((a, b) => b.sol - a.sol);
        break;
      case 'oldest':
        filtered = filtered.sort((a, b) => a.sol - b.sol);
        break;
      case 'camera':
        filtered = filtered.sort((a, b) => a.camera.name.localeCompare(b.camera.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [photos, filters]);

  // Pagination
  const paginatedPhotos = useMemo(() => {
    const startIndex = (currentPage - 1) * photosPerPage;
    return filteredPhotos.slice(startIndex, startIndex + photosPerPage);
  }, [filteredPhotos, currentPage, photosPerPage]);

  const totalPages = Math.ceil(filteredPhotos.length / photosPerPage);

  const handleFilterChange = useCallback((filterKey, value) => {
    const newFilters = { ...filters, [filterKey]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Notify parent component
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
    
    playSound('click');
  }, [filters, onFilterChange, playSound]);

  const handlePhotoClick = useCallback((photo) => {
    setSelectedPhoto(photo);
    playSound('click');
  }, [playSound]);

  const closeModal = useCallback(() => {
    setSelectedPhoto(null);
    playSound('click');
  }, [playSound]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      playSound('click');
    }
  }, [currentPage, totalPages, playSound]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      playSound('click');
    }
  }, [currentPage, playSound]);

  if (!photos || photos.length === 0) {
    return (
      <div className="mars-gallery-container">
        <div className="gallery-empty">
          <i className="material-icons">photo_library</i>
          <h3>No photos available</h3>
          <p>Try selecting different filters or check back later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mars-gallery-container">
      <div className="gallery-header">
        <div className="gallery-title">
          <h2>
            <i className="material-icons me-2">collections</i>
            Mars Photo Gallery
          </h2>
          <p>Showing {filteredPhotos.length} photos from {selectedRover} rover</p>
        </div>
        
        <div className="view-controls">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('grid');
              playSound('click');
            }}
          >
            <i className="material-icons">grid_view</i>
          </button>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('list');
              playSound('click');
            }}
          >
            <i className="material-icons">view_list</i>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="gallery-filters">
        <div className="filter-group">
          <label>Camera:</label>
          <select 
            value={filters.camera} 
            onChange={(e) => handleFilterChange('camera', e.target.value)}
          >
            {filterOptions.cameras.map((camera, index) => (
              <option key={`camera-${camera.value || 'all'}-${index}-${camera.label}`} value={camera.value}>
                {camera.label} {camera.count ? `(${camera.count})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Sol:</label>
          <select 
            value={filters.sol} 
            onChange={(e) => handleFilterChange('sol', e.target.value)}
          >
            <option value="">All Sols</option>
            {filterOptions.sols.map(sol => (
              <option key={sol} value={sol}>Sol {sol}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select 
            value={filters.sortBy} 
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="camera">Camera Name</option>
          </select>
        </div>

        <div className="filter-stats">
          <span className="photo-count">
            {filteredPhotos.length} photos found
          </span>
        </div>
      </div>

      {/* Photo Grid */}
      <div className={`photo-gallery ${viewMode}`}>
        {paginatedPhotos.map((photo, index) => (
          <div 
            key={`${photo.id}-${index}`}
            className="photo-item"
            onClick={() => handlePhotoClick(photo)}
          >
            <div className="photo-container">
              <img 
                src={photo.img_src} 
                alt={`Mars surface from ${photo.camera.full_name}`}
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/placeholder-mars.png'; // Fallback image
                }}
              />
              <div className="photo-overlay">
                <div className="photo-info">
                  <span className="camera-name">{photo.camera.name.toUpperCase()}</span>
                  <span className="sol-info">Sol {photo.sol}</span>
                </div>
                <div className="photo-actions">
                  <button className="expand-btn">
                    <i className="material-icons">fullscreen</i>
                  </button>
                </div>
              </div>
            </div>
            
            {viewMode === 'list' && (
              <div className="photo-details">
                <h4>{photo.camera.full_name}</h4>
                <p>Sol {photo.sol} • {photo.earth_date}</p>
                <p>Rover: {photo.rover.name}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="page-btn" 
            onClick={prevPage} 
            disabled={currentPage === 1}
          >
            <i className="material-icons">chevron_left</i>
            Previous
          </button>
          
          <div className="page-info">
            Page {currentPage} of {totalPages}
          </div>
          
          <button 
            className="page-btn" 
            onClick={nextPage} 
            disabled={currentPage === totalPages}
          >
            Next
            <i className="material-icons">chevron_right</i>
          </button>
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="photo-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>
              <i className="material-icons">close</i>
            </button>
            
            <div className="modal-image">
              <img 
                src={selectedPhoto.img_src} 
                alt={`Mars surface from ${selectedPhoto.camera.full_name}`}
              />
            </div>
            
            <div className="modal-info">
              <h3>{selectedPhoto.camera.full_name}</h3>
              <div className="modal-details">
                <div className="detail-item">
                  <strong>Sol:</strong> {selectedPhoto.sol}
                </div>
                <div className="detail-item">
                  <strong>Earth Date:</strong> {selectedPhoto.earth_date}
                </div>
                <div className="detail-item">
                  <strong>Rover:</strong> {selectedPhoto.rover.name}
                </div>
                <div className="detail-item">
                  <strong>Camera:</strong> {selectedPhoto.camera.name.toUpperCase()}
                </div>
              </div>
              
              <div className="modal-actions">
                <a 
                  href={selectedPhoto.img_src} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-btn"
                  onClick={() => playSound('click')}
                >
                  <i className="material-icons">open_in_new</i>
                  View Full Size
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarsGallery;
