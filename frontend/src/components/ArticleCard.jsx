import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../global.css";
import { Buffer } from "buffer"; // Import buffer module
window.Buffer = Buffer; // Polyfill Buffer object

function ArticleCard({ article }) {
  const imageSrc =
    article.images && article.images.length > 0
      ? `data:${article.images[0].contentType};base64,${Buffer.from(
          article.images[0].data
        ).toString("base64")}`
      : "placeholder-image-url"; // Replace with a default/placeholder image URL
  return (
    <Card
      className="bg-dark text-white mb-4"
      style={({ height: "100%" ,  border: "0px"  })}
    >
      {/* Added bg-dark and text-white classes and added height for uniformity */}
      <Card.Img variant="top" src={imageSrc} />
      <Card.Body>
        <Card.Title className="h5" style={({ color: " color: #7c440b"  })}>{article.title}</Card.Title>{" "}
        {/* Changed title to h5 */}
        <Card.Text>{article.content.substring(3, 100)}...</Card.Text>
        <Button
          as={Link}
          to={`/articles/${article._id}`}
          variant="outline-primary" // Change button to outline-primary
          className="btn-block" // Make the button take the full width
        >
          Read More
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ArticleCard;
