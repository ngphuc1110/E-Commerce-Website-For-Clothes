import React, { useState } from "react";
import { useGetAllProductsQuery } from "../../features/productsApi";
import { Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import menImage from "../images/men.jpeg";
import womenImage from "../images/women.jpg";
import { lightBlue } from "@mui/material/colors";

const Home = () => {
  const { data, error, isLoading } = useGetAllProductsQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = data?.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(data?.length / productsPerPage);

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

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div>
      <div
        style={{
          width: "100%",
          height: "200px",
          border: "1px solid black",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          backgroundColor: lightBlue,
        }}
      >
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>UMI SHOP</h1>
        <p style={{ fontSize: "18px", textAlign: "center" }}>
          Take Your Wardrobe to the Next Level With Umi's Services
        </p>
      </div>

      <div className="category-section">
        <h2 className="category-heading">Explore Categories</h2>
        <div className="category-images">
          <Link to="/category/Men" className="category-image">
            <img src={menImage} alt="Men Clothing" />
            <div className="category-overlay">
              <span>To Men Category</span>
            </div>
          </Link>
          <Link to="/category/Women" className="category-image">
            <img src={womenImage} alt="Women Clothing" />
            <div className="category-overlay">
              <span>To Women Category</span>
            </div>
          </Link>
        </div>
      </div>
      <div>
        <h2 className="product-heading">Products</h2>
        <div className="products">
          {currentProducts?.map((product) => (
            <div key={product.ProductID} className="product">
              <Link to={`/product/${product.ProductID}`}>
                <img src={product.Image} alt={product.Name} />
              </Link>
              <div className="details">
                <h3>{product.Name}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          {totalPages > 1 && (
            <Pagination>
              {currentPage > 1 && (
                <Pagination.Prev onClick={handlePreviousPage} />
              )}
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              {currentPage < totalPages && (
                <Pagination.Next onClick={handleNextPage} />
              )}
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
