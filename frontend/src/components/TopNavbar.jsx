import React, { useState, useLayoutEffect, useContext} from "react";
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../img/logo.png"; // Import your logo image
import "../global.css";
import { UserContext } from '../context/UserContext';

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
  const { user, logout } = useContext(UserContext);

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
            <Nav.Link as={Link} to="/shopItems">
              Merch Shop
            </Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <>
                <Nav.Link as={Link} to={`/cart`}>
                  Cart
                </Nav.Link>
                <Nav.Link as={Link} to={`/users/${user._id}`}>
                  Profile
                </Nav.Link>
                <Nav.Link onClick={logout}>Log Out</Nav.Link>
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
