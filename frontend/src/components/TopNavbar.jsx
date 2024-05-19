import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../img/logo.png"; // Import your logo image
import "../global.css";
import Cookies from "universal-cookie"; // Import the universal-cookie library
import jwt_decode from "jwt-decode"; // Import jwt-decode to decode JWT tokens

const categories = [
  "F1",
  "MotoGP",
  "NASCAR",
  "IndyCar",
  "WEC",
  "WRC",
  "IMSA",
  "DTM",
];

function TopNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token"); // Get token from cookies

    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        setUserId(decodedToken.userId);
        setIsLoggedIn(true);
      } catch (error) {
        // Invalid token, clear local storage and set to not logged in
        console.error("Invalid token:", error);
        cookies.remove("token");
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleLogout = () => {
    const cookies = new Cookies();
    cookies.remove("token");
    setIsLoggedIn(false);
    navigate("/"); // Redirect to home page or any other page after logout
  };

  return (
    <Navbar expand="lg" className="mb-4 custom-navbar">
      {" "}
      {/* Add custom-navbar class */}
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="ps-0">
          <img
            src={logo}
            width="65"
            height="30"
            className="d-inline-block align-left"
            alt="Motorsport News Logo"
          />{" "}
          <span className="brand-text">Motorsport</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {categories.map((category) => (
              <Nav.Link
                as={Link}
                to={`/articles/category/${category.toLowerCase()}`}
                key={category}
              >
                {category}
              </Nav.Link>
            ))}
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <>
                <Nav.Link as={Link} to={`/users/${userId}`}>
                  Profile
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>Log Out</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="users/login">
                  Log In
                </Nav.Link>
                <Nav.Link as={Link} to="users/signup">
                  Sign Up
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;
