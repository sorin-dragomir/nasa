import React from "react";
import "./DataCard.css";

const DataCard = ({ title, value, subtitle, icon, trend, color = "cyan", size = "medium", loading = false }) => {
  if (loading) {
    return (
      <div className={`data-card loading ${size}`}>
        <div className="card-loading">
          <div className="loading-icon"></div>
          <div className="loading-text"></div>
          <div className="loading-subtitle"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`data-card ${color} ${size}`}>
      {icon && (
        <div className="card-icon">
          <i className="material-icons">{icon}</i>
        </div>
      )}

      <div className="card-content">
        <div className="card-value">
          {value}
          {trend && (
            <span className={`trend ${trend.direction}`}>
              <i className="material-icons">{trend.direction === "up" ? "trending_up" : trend.direction === "down" ? "trending_down" : "trending_flat"}</i>
              {trend.value}
            </span>
          )}
        </div>

        <div className="card-title">{title}</div>

        {subtitle && <div className="card-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
};

export default DataCard;
