import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { UserContext } from "../context/UserContext"; // Assuming you have UserContext
import "../global.css";

function ProfilePage() {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    axios
      .get(`/users/${currentUser._id}`)
      .then((response) => {
        setUser(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
          oldPassword: "",
          newPassword: "",
        });
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, [currentUser._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .patch(`/users/${currentUser._id}`, {
        username: formData.username,
        email: formData.email,
        password: formData.newPassword || undefined,
        oldPassword: formData.oldPassword,
      })
      .then((response) => {
        setUser(response.data);
        alert("Profile updated successfully");
      })
      .catch((error) => {
        alert("Error updating profile: " + error.message);
      });
  };

  const handleDelete = () => {
    axios
      .delete(`/users/${currentUser._id}`)
      .then(() => {
        alert("Account deleted successfully");
        navigate("/");
      })
      .catch((error) => {
        alert("Error deleting account: " + error.message);
      });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container className="profile-page">
      <h2>Profile Page</h2>
      <Form onSubmit={handleUpdate}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formOldPassword">
          <Form.Label>Old Password</Form.Label>
          <Form.Control
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formNewPassword">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Update Profile
        </Button>
        <Button variant="danger" onClick={handleDelete} className="ml-2">
          Delete Account
        </Button>
      </Form>

      {user?.role === "admin" && (
        <div className="admin-options">
          <h3>Admin Options</h3>
          <Row>
            <Col>
              <h4>Manage Articles</h4>
              <Button
                variant="success"
                onClick={() => navigate("/articles/create")}
              >
                Create Article
              </Button>
              <Button variant="info" onClick={() => navigate("/articles")}>
                View Articles
              </Button>
            </Col>
            <Col>
              <h4>Manage Shop Items</h4>
              <Button
                variant="success"
                onClick={() => navigate("/shopitems/create")}
              >
                Create Shop Item
              </Button>
              <Button variant="info" onClick={() => navigate("/shopitems")}>
                View Shop Items
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </Container>
  );
}

export default ProfilePage;
