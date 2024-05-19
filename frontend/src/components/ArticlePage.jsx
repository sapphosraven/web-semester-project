import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Image, Badge } from "react-bootstrap";
import ArticleCard from "./ArticleCard";
import SideBar from "./SideBar";
import "../global.css";

function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching article with id:", id);
    axios
      .get(`/articles/${id}`)
      .then((response) => {
        console.log("Received response:", response.data);
        setArticle(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching article:", error);
        setError(error.message || "An error occurred"); // Set a more user-friendly error message
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <div style={{ color: "white" }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "white" }}>Error: {error}</div>;
  }

  if (article && article.content) {
    const articleContent = article.content;

    // Split content into paragraphs based on <p> tags
    const paragraphs = articleContent.split("</p>").filter(Boolean);

    // Create image elements separately

    var imageElements = [];
    if (article.images) {
      imageElements = article.images.map((image, index) => {
        const imageSrc = `data:${image.contentType};base64,${Buffer.from(
          image.data
        ).toString("base64")}`;
        return (
          <Image
            key={index}
            src={imageSrc}
            fluid
            className="my-3 img-fluid"
            alt={article.title}
          />
        );
      });
    }
    // Insert images after every 2-4 paragraphs (randomly), but skip the first image
    const paragraphsWithImages = paragraphs.reduce((acc, paragraph, index) => {
      acc.push(
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      );

      // Check if we should insert an image after this paragraph
      if (index > 0 && imageElements[index] && Math.random() < 0.35) {
        acc.push(imageElements[index]);
      }
      return acc;
    }, []);

    const formattedCreatedAt = new Date(article.createdAt).toLocaleDateString(
      "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );

    return (
      <Container className="text-white position-relative" fluid>
        <Row>
          <Col md={8} className="mb-4">
            <Badge bg=" #9370db" className="mb-2 category-badge">
              {article.category}
            </Badge>
            <h2 className="text-start mb-2">{article.title}</h2>
            {/* Author and Date Information */}
            {article.author && (
              <p className="fst-italic">
                By {article.author.username} <br></br> Published:{" "}
                {formattedCreatedAt}
              </p>
            )}
            <hr className="horizontal-line" />
            {imageElements.length > 0 && imageElements[0]}
            <div className="article-content">{paragraphsWithImages}</div>
          </Col>

          <Col md={4} className="sidebar-col">
            <SideBar />
          </Col>
        </Row>
      </Container>
    );
  } else {
    // Handle the case where article is not found or doesn't have content
    return (
      <div style={{ color: "white" }}>
        Article not found or content is missing.
      </div>
    );
  }
}


export default ArticlePage;
