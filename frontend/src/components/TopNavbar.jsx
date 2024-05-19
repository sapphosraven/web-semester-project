import React, { useState, useLayoutEffect } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../img/logo.png"; // Import your logo image
import "../global.css";
import Cookies from "universal-cookie"; // Import the universal-cookie library
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [tokenSet, setTokenSet] = useState(false);

  useLayoutEffect(() => {
    if (tokenSet) {
      const cookies = new Cookies();
      const token = cookies.get("token");
      if (token) {
        console.log("a");
        try {
          const decodedToken = jwt_decode(token);
          setUserId(decodedToken.userId);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Invalid token:", error);
          cookies.remove("token");
          setIsLoggedIn(false);
        }
      }
    }
  }, [tokenSet]);

  const handleLogout = () => {
    const cookies = new Cookies();
    cookies.remove("token");
    cookies.remove("userId"); // Remove userId cookie as well
    setIsLoggedIn(false);
    navigate("/");
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
            <Nav.Link as={Link} to="/shopItems">
              ShopItems
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
                <Button as={Link} to="/cart" variant="outline-primary" className="me-2">
                Cart
              </Button>
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
