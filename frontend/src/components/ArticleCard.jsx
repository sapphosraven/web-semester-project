import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../global.css'; // Create this file for custom styles (optional)


function ArticleCard({ article }) {

    // Handle the case where there's no image
    const imageSrc = article.images && article.images.length > 0 
        ? `data:${article.images[0].contentType};base64,${Buffer.from(article.images[0].data).toString('base64')}`
        : 'placeholder-image-url'; // Replace with a default/placeholder image URL

    return (
        <Card className="mb-4">
            <Card.Img variant="top" src={imageSrc} /> 
            <Card.Body>
                <Card.Title>{article.title}</Card.Title>
                <Card.Text>
                    {/* Shortened excerpt or preview of the article content */}
                    {article.content.substring(0, 100)}... 
                </Card.Text>
                <Button as={Link} to={`/articles/${article._id}`} variant="primary">Read More</Button>
            </Card.Body>
        </Card>
    );
}

export default ArticleCard;