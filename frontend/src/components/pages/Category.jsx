import { useGetCategoryQuery } from "../../features/productsApi";
import { Link } from "react-router-dom";
import cateImage from "../images/category.webp";
import { Card, Row, Col } from "react-bootstrap";

const Home = () => {
  const { data, error, isLoading } = useGetCategoryQuery();

  return (
    <div className="categoryPage-container">
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>An error occurred</p>
      ) : (
        <>
          <div className="category-section">
            <img src={cateImage} alt="Category" style={{ width: "100%" }} />
            <span className="category-heading">Category</span>
          </div>
          <Row className="justify-content-center">
            {data?.map((category) => (
              <Col md={4} key={category.CategoryID}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>{category.Name}</Card.Title>
                    <Link to={`/category/${category.Name}`}>
                      <Card.Img
                        style={{ height: "300px" }}
                        variant="top"
                        src={category.Image}
                        alt={category.Name}
                      />
                    </Link>
                    <Card.Text className="mt-2">
                      {category.Description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
};

export default Home;
