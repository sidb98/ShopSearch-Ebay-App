import React, { useState } from "react";
import "./styles.css";

const ImageModal = ({ images, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextClick = () => {
    setCurrentImageIndex((currentImageIndex + 1) % images.length);
  };

  const handlePreviousClick = () => {
    setCurrentImageIndex(
      (currentImageIndex - 1 + images.length) % images.length
    );
  };

  const handleCloseClick = () => {
    setCurrentImageIndex(0);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="headerContainer">
          <h3>Product Image</h3>
          <div className="crossbutton" onClick={handleCloseClick}>
            &times;
          </div>
        </div>

        <hr></hr>
        <div className="imageContainer">
          <img src={images[currentImageIndex]} alt="product" />
        </div>
        <div className="controls">
          <button onClick={handlePreviousClick}>&lt;</button>
          <button onClick={handleNextClick}>&gt;</button>
        </div>
        <div className="closeButton" onClick={handleCloseClick}>
          Close
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
