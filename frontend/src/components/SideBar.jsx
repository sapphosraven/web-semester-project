import React from "react";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faYoutube
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons'; // Import from free-solid-svg-icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container } from "react-bootstrap"; // Import Container
import "../global.css"; // Create this file for custom styles

function Sidebar() {
  return (
    <div className="position-sticky">
      <Container>
        <div className="p-4 mb-3 bg-none rounded">
          <h4 className="fst-italic" style={{ color: "#9370db" }}>
            About
          </h4>
          <p className="mb-0">
            Formed in 2024, Motorsport is definitely, a website, that works most
            of the time. It is part of the efforts put in by a rag tag bunch
            of Students from BSCS-12-C. Its goal? To not crash every time we
            perform a basic crud operation.
          </p>
        </div>

        <div className="p-4">
          {/* Social Media Section (Modified) */}
          <h4 className="fst-italic" style={{ color: "#9370db" }}>
            Social Media
          </h4>
          <ul className="list-unstyled">
            <li>
              <a href="#" className="social-link">
                <FontAwesomeIcon icon={faFacebook} size="2x" /> Facebook
              </a>
            </li>
            <li>
              <a href="#" className="social-link">
                <FontAwesomeIcon icon={faTwitter} size="2x" /> Twitter
              </a>
            </li>
            <li>
              <a href="#" className="social-link">
                <FontAwesomeIcon icon={faInstagram} size="2x" /> Instagram
              </a>
            </li>
            <li>
              <a href="#" className="social-link">
                <FontAwesomeIcon icon={faYoutube} size="2x" /> YouTube
              </a>
            </li>
          </ul>
        </div>

          {/* Newsletter Section */}
          <div className="p-4 mb-3 rounded">
          <h4 className="fst-italic" style={{ color: "#9370db" }}>
            Subscribe to our Newsletter
          </h4>
          <p>
            Get the latest motorsport news, race results, exclusive interviews,
            and technical insights delivered straight to your inbox. Stay ahead
            of the curve and never miss a beat!
          </p>
          <button className="btn btn-primary btn-block">
            <FontAwesomeIcon icon={faEnvelopeOpen} /> Subscribe
          </button>
        </div>
      </Container>
    </div>
  );
}

export default Sidebar;
