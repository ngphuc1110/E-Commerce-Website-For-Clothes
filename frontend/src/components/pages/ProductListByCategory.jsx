import React from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { useGetProductsByCategoryQuery } from "../../features/productsApi";
import { addToCart } from "../../features/cartSlice";
import { Row, Col, Card, Button } from "react-bootstrap";
import newImage from "../images/new.webp";

const ProductListByCategory = () => {
  const { CategoryName } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const { data, error, isLoading } =
    useGetProductsByCategoryQuery(CategoryName);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    history.push("/cart");
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.log(error);
    return <p>An error occurred</p>;
  }

  if (!data) {
    return null;
  }

  const renderProductCards = () => {
    return data.map((product) => (
      <Col md={6} lg={3} key={product.ProductID}>
        <Card className="product">
          <Card.Body>
            <Card.Title>{product.Name}</Card.Title>
            <Link to={`/product/${product.ProductID}`}>
              <Card.Img variant="top" src={product.Image} alt={product.Name} />
            </Link>
            <Card.Text
              style={{
                textAlign: "right",
                fontSize: "24px",
              }}
            >
              <strong>{product.Price} VND</strong>
            </Card.Text>
            <Button
              variant="primary"
              onClick={() => handleAddToCart(product)}
              className="mt-3"
            >
              Add To Cart
            </Button>
          </Card.Body>
        </Card>
      </Col>
    ));
  };

  return (
    <div className="home-container">
      <div className="category-section">
        <img src={newImage} alt="Category" style={{ width: "100%" }} />
        <span className="category-heading">{}</span>
      </div>
      <Row>{renderProductCards()}</Row>
    </div>
  );
};

export default ProductListByCategory;
