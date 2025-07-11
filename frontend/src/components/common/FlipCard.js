import React, { useState } from "react";
import { useSound } from "../../contexts/SoundContext";
import "./FlipCard.css";

const FlipCard = ({
  frontTitle,
  frontValue,
  frontSubtitle,
  frontIcon,
  backTitle,
  backValue,
  backSubtitle,
  backIcon,
  color = "cyan",
  size = "medium",
  autoFlip = false,
  flipInterval = 3000,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const { playSound } = useSound();

  // Detect touch device
  React.useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Auto-flip functionality
  React.useEffect(() => {
    if (autoFlip) {
      const interval = setInterval(() => {
        setIsFlipped((prev) => !prev);
      }, flipInterval);
      return () => clearInterval(interval);
    }
  }, [autoFlip, flipInterval]);

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      playSound("click");
      setIsFlipped(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setIsFlipped(false);
    }
  };

  const handleClick = () => {
    if (isTouchDevice) {
      playSound("click");
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div className={`flip-card ${color} ${size}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
      <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
        {/* Front Side */}
        <div className="flip-card-front">
          {frontIcon && (
            <div className="card-icon">
              <i className="material-icons">{frontIcon}</i>
            </div>
          )}
          <div className="card-content">
            <div className="card-value">{frontValue}</div>
            <div className="card-title">{frontTitle}</div>
            {frontSubtitle && <div className="card-subtitle">{frontSubtitle}</div>}
          </div>
          <div className="flip-indicator">
            <i className="material-icons">{isTouchDevice ? "touch_app" : "mouse"}</i>
          </div>
        </div>

        {/* Back Side */}
        <div className="flip-card-back">
          {backIcon && (
            <div className="card-icon">
              <i className="material-icons">{backIcon}</i>
            </div>
          )}
          <div className="card-content">
            <div className="card-value">{backValue}</div>
            <div className="card-title">{backTitle}</div>
            {backSubtitle && <div className="card-subtitle">{backSubtitle}</div>}
          </div>
          <div className="flip-indicator">
            <i className="material-icons">{isTouchDevice ? "touch_app" : "mouse"}</i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
