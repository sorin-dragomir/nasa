import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../common";
import "./Header.css";

const Header = ({ onNav }) => {
  const location = useLocation();

  const isActive = (path) => {
    // Handle exact path matching
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-auto">
            <Link to="/" className="header-title-link d-flex align-items-center" onClick={onNav}>
              <img src="/favicon.png" alt="NASA Logo" className="header-logo me-3" />
              <div className="header-title">
                <div className="logo-text">NASA</div>
                <div className="banner-text">Mission Control</div>
              </div>
            </Link>
          </div>
          <div className="col">
            <nav className="header-nav ms-auto d-flex justify-content-end">
              <Button className="nav-item" onClick={onNav}>
                <Link className={`nav-link ${isActive("/") ? "active" : ""}`} to="/">
                  <i className="material-icons">home</i>
                  <span>Home</span>
                </Link>
              </Button>
              <Button className="nav-item" onClick={onNav}>
                <Link className={`nav-link ${isActive("/mars") ? "active" : ""}`} to="/mars">
                  <i className="material-icons">terrain</i>
                  <span>Mars</span>
                </Link>
              </Button>
              <Button className="nav-item" onClick={onNav}>
                <Link className={`nav-link ${isActive("/apod") ? "active" : ""}`} to="/apod">
                  <i className="material-icons">photo_camera</i>
                  <span>APOD</span>
                </Link>
              </Button>
              <Button className="nav-item" onClick={onNav}>
                <Link className={`nav-link ${isActive("/neo") ? "active" : ""}`} to="/neo">
                  <i className="material-icons">public</i>
                  <span>NEO</span>
                </Link>
              </Button>
              <Button className="nav-item" onClick={onNav}>
                <Link className={`nav-link ${isActive("/iss") ? "active" : ""}`} to="/iss">
                  <i className="material-icons">satellite</i>
                  <span>ISS</span>
                </Link>
              </Button>
              <Button className="nav-item" onClick={onNav}>
                <Link className={`nav-link ${isActive("/chatbot") ? "active" : ""}`} to="/chatbot">
                  <i className="material-icons">smart_toy</i>
                  <span>Ask NASA</span>
                </Link>
              </Button>
              <Button className="nav-item" onClick={onNav}>
                <Link className={`nav-link ${isActive("/launch") ? "active" : ""}`} to="/launch">
                  <i className="material-icons">rocket_launch</i>
                  <span>Launch</span>
                </Link>
              </Button>
              <Button className="nav-item" onClick={onNav}>
                <Link className={`nav-link ${isActive("/upcoming") ? "active" : ""}`} to="/upcoming">
                  <i className="material-icons">schedule</i>
                  <span>Upcoming</span>
                </Link>
              </Button>
              <Button className="nav-item" onClick={onNav}>
                <Link className={`nav-link ${isActive("/history") ? "active" : ""}`} to="/history">
                  <i className="material-icons">history</i>
                  <span>History</span>
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
