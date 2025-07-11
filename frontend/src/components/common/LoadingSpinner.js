import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = ({ size = "medium", message = "Loading..." }) => {
  return (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner">
        <div className="orbit orbit-1"></div>
        <div className="orbit orbit-2"></div>
        <div className="orbit orbit-3"></div>
        <div className="center-planet"></div>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
