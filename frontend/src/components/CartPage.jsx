import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Button } from "react-bootstrap";
import SideBar from "./SideBar";

function CartPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch orders for the logged-in user
    const token = localStorage.getItem("token");
    axios
      .get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Orders:", response.data);
        setOrders(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setError(error.message || "An error occurred");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div style={{ color: "white" }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "white" }}>Error: {error}</div>;
  }

  return (
    <Container className="text-white position-relative" fluid>
      <Row>
        <Col md={8} className="mb-4">
          <h2 className="text-start mb-2">Cart</h2>
          <hr className="horizontal-line" />
          {orders.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="mb-3">
                <h4>Order ID: {order._id}</h4>
                <p>Status: {order.status}</p>
                <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
              </div>
            ))
          )}
        </Col>
        <Col md={4} className="sidebar-col">
          <SideBar />
        </Col>
      </Row>
    </Container>
  );
}

export default CartPage;
