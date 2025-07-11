import React from "react";
import { playDirectSound } from "../../utils/directSoundManager";
import "./Button.css";

const Button = ({ children, onClick, className = "", soundType = "click", type = "button", ...rest }) => {
  const handleClick = (e) => {
    // Use direct sound manager (working solution)
    playDirectSound(soundType);

    // Call the original onClick handler if provided
    if (onClick) {
      onClick(e);
    }
  };

  // Use button element for proper form handling
  return (
    <button type={type} className={`button ${className}`} onClick={handleClick} {...rest}>
      {children}
    </button>
  );
};

export default Button;
