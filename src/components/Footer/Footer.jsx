import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2 className="footer-title">Word Chain</h2>
          <p className="footer-description">
            Improve your English vocabulary with the Word Chain game and have a
            fun time.
          </p>
        </div>

        <div className="footer-links">
          <h3 className="footer-section-title">Quick Links</h3>
          <Link to="/" className="footer-link">
            Home
          </Link>
          <Link to="/game" className="footer-link">
            Game
          </Link>
        </div>

        <div className="social-links">
          <h3 className="footer-section-title">Social Media</h3>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="Twitter"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="Facebook"
          >
            <i className="fab fa-facebook"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="Instagram"
          >
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Word Chain. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
