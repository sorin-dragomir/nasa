import React, { useState } from "react";
import { useSound } from "../../contexts/SoundContext";
import "./ImageGallery.css";

const ImageGallery = ({ images = [], title = "Gallery", loading = false }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { playSound } = useSound();
  const imagesPerPage = 12;

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);
  const totalPages = Math.ceil(images.length / imagesPerPage);

  const openModal = (image) => {
    playSound("click");
    setSelectedImage(image);
  };

  const closeModal = () => {
    playSound("click");
    setSelectedImage(null);
  };

  const nextPage = () => {
    playSound("click");
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    playSound("click");
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="image-gallery loading">
        <div className="gallery-loading">
          <div className="loading-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="image-placeholder"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="image-gallery empty">
        <div className="empty-state">
          <i className="material-icons">photo_library</i>
          <h3>No images available</h3>
          <p>Try adjusting your search criteria or check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="image-gallery">
      <div className="gallery-header">
        <h2 className="gallery-title">{title}</h2>
        <div className="gallery-info">
          {images.length} {images.length === 1 ? "image" : "images"}
        </div>
      </div>

      <div className="gallery-grid">
        {currentImages.map((image, index) => (
          <div key={index} className="gallery-item" onClick={() => openModal(image)}>
            <div className="image-container">
              <img
                src={image.url || image.src}
                alt={image.title || image.alt || `Image ${index + 1}`}
                loading="lazy"
                onError={(e) => {
                  e.target.src = "/img/placeholder.jpg";
                }}
              />
              <div className="image-overlay">
                <i className="material-icons">zoom_in</i>
              </div>
            </div>
            {image.title && (
              <div className="image-info">
                <h4 className="image-title">{image.title}</h4>
                {image.date && <span className="image-date">{image.date}</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="gallery-pagination">
          <button className="pagination-btn" onClick={prevPage} disabled={currentPage === 1}>
            <i className="material-icons">chevron_left</i>
            Previous
          </button>

          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>

          <button className="pagination-btn" onClick={nextPage} disabled={currentPage === totalPages}>
            Next
            <i className="material-icons">chevron_right</i>
          </button>
        </div>
      )}

      {selectedImage && (
        <div className="image-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <i className="material-icons">close</i>
            </button>
            <img src={selectedImage.hdurl || selectedImage.url || selectedImage.src} alt={selectedImage.title || "Full size image"} />
            <div className="modal-info">
              {selectedImage.title && <h3 className="modal-title">{selectedImage.title}</h3>}
              {selectedImage.date && <p className="modal-date">{selectedImage.date}</p>}
              {selectedImage.explanation && <p className="modal-description">{selectedImage.explanation}</p>}
              {selectedImage.copyright && <p className="modal-copyright">© {selectedImage.copyright}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
