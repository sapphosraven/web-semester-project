import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap"; // Import Bootstrap components
import SideBar from "./SideBar"; // Import SideBar component
import "../global.css";
import { Link } from "react-router-dom";

function MerchPage() {
  const [shopItems, setShopItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const itemsToDisplay = shopItems.slice(0, 9); // Display only the first 9 items

  useEffect(() => {
    // Fetch latest shop items from your backend API
    axios
      .get("/shopItems")
      .then((response) => {
        setShopItems(response.data);
        setIsLoading(false); // Data fetched, set isLoading to false
      })
      .catch((error) => {
        console.error("Error fetching shop items:", error);
        setError(error); // Set error message
        setIsLoading(false); // Stop loading even if there's an error
      });
  }, []); // Empty dependency array ensures this runs only once on mount

  if (isLoading) {
    return <div style={{ color: "white" }}>Loading...</div>; // Show loading message while fetching data
  }

  if (error) {
    return <div style={{ color: "white" }}>Error: {error.message}</div>; // Show error message if fetching fails
  }

  return (
    <Container className="text-white position-relative" fluid>
      {" "}
      {/* Use fluid container */}
      <Row>
        <Col md={8} className="mb-4">
          {/* Modified Heading */}
          <h2 className="text-start mb-2">Recent Merchandise</h2>
          <hr className="horizontal-line"></hr>
          <Row xs={1} md={3} className="g-4">
            {itemsToDisplay.map((item) => (
              <Col key={item._id}>
                <Card style={{ width: "18rem" }}>
                  {item.images && item.images.length > 0 && (
                    <Card.Img
                      variant="top"
                      src={`data:${item.images[0].contentType};base64,${Buffer.from(
                        item.images[0].data.data
                      ).toString("base64")}`}
                      alt={item.name}
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>{item.description}</Card.Text>
                    <Card.Text>${item.price.toFixed(2)}</Card.Text>
                    <Button
                        as={Link}
                        to={`/shopItems/${item._id}`}
                        variant="primary">
                        View Merch
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col md={4} className="sidebar-col">
          <SideBar />
        </Col>
      </Row>
    </Container>
  );
}

export default MerchPage;
