import React from "react";
import { Container } from "../common";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <p className="footer-text">
          This website is independently operated and is not affiliated with NASA, SpaceX, or any of their partners. It is intended solely for educational and
          informational purposes.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
