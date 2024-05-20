import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Image, Badge, Button } from "react-bootstrap";
import SideBar from "./SideBar";
import "../global.css";

function ShopItemPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("Fetching shop item with id:", id);
    axios
      .get(`/shopItems/${id}`)
      .then((response) => {
        console.log("Received response:", response.data);
        setItem(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching shop item:", error);
        setError(error.message || "An error occurred");
        setIsLoading(false);
      });
      
    // Fetch user details
    const token = localStorage.getItem("token");
    axios
      .get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("User details:", response.data);
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User not authenticated.");
        // Handle unauthenticated user
        return;
      }

      const response = await axios.post(
        "/orders",
        {
          user: user._id, // Use user ID fetched from user details
          items: [{ shopItem: item._id, quantity: 1 }], // Assuming quantity is always 1
          totalAmount: item.price, // Assuming total amount is the item's price
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Item added to cart:", response.data);
      // Optionally, you can redirect the user to the cart page or display a success message
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  if (isLoading) {
    return <div style={{ color: "white" }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "white" }}>Error: {error}</div>;
  }

  if (item) {
    return (
      <Container className="text-white position-relative" fluid>
        <Row>
          <Col md={8} className="mb-4">
            <Image
              src={`data:${item.images[0].contentType};base64,${Buffer.from(
                item.images[0].data
              ).toString("base64")}`}
              fluid
            />
            <h2 className="text-start mb-2 my-3">{item.name}</h2>
            <p>{item.description}</p>
            <p>Price: ${item.price.toFixed(2)}</p>
            <Button variant="primary" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </Col>
          <Col md={4} className="sidebar-col">
            <SideBar />
          </Col>
        </Row>
      </Container>
    );
  } else {
    return (
      <div style={{ color: "white" }}>
        Shop item not found or data is missing.
      </div>
    );
  }
}

export default ShopItemPage;
