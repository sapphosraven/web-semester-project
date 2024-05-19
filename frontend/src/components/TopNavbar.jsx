import React, { useState, useEffect, useContext } from "react";
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import logo from "../img/logo.png";
import "../global.css";
import Cookies from "universal-cookie";
const jwt_decode = require("jwt-decode"); // Correct import

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
  const { isLoggedIn, user, logout, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        login(decodedToken);
      } catch (error) {
        console.error("Invalid token:", error);
        cookies.remove("token");
      }
    }
  }, []);

  const handleLogout = () => {
    const cookies = new Cookies();
    cookies.remove("token");
    logout(); // Call the logout function from context
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="mb-4 custom-navbar">
      <Container fluid>
        {/* Logo and Brand */}
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
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/shopItems">
              Merch
            </Nav.Link>
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
                <Button
                  as={Link}
                  to="/cart"
                  variant="outline-primary"
                  className="me-2"
                >
                  Cart
                </Button>
                <Nav.Link as={Link} to={`/users/${user.userId}`}>
                  {" "}
                  {/* Use user.userId */}
                  Profile
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>Log Out</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Log In
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
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
