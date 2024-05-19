import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "../global.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/users/login", {
        username,
        password,
      });
      if (response.data.token) {
        // Login successful, redirect to home page
        console.log("login sucessfull");
        navigate("/");
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container
      className="text-white position-relative"
      style={{ minHeight: "calc(100vh - 185px)" }}
    >
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
