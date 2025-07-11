import React from "react";
import "./Container.css";

const Container = ({ className = "", children, ...rest }) => {
  return (
    <div className={`container ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default Container;
