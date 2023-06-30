const express = require("express");
const router = express.Router();
const connection = require("../connection");

// Retrieve category
router.get("/category", (req, res) => {
  const categoryName = req.params.categoryName;
  const query = `
    SELECT * FROM Category
  `;
  connection.query(query, [categoryName], (error, results) => {
    if (error) {
      console.error("Error executing the query:", error);
      return res.status(500).send("Error executing the query");
    }

    res.json(results);
  });
});

// Retrieve products by category name
router.get("/category/:categoryName", (req, res) => {
  const categoryName = req.params.categoryName;
  const query = `
    SELECT p.ProductID, p.Name, p.Description, p.Image, p.Price
    FROM product p
    INNER JOIN category_contains cc ON p.ProductID = cc.ProductID
    INNER JOIN category c ON c.CategoryID = cc.CategoryID
    WHERE c.Name = ?
  `;
  connection.query(query, [categoryName], (error, results) => {
    if (error) {
      console.error("Error executing the query:", error);
      return res.status(500).send("Error executing the query");
    }

    res.json(results);
  });
});

// Create a new Product by Category
router.post("/category", async (req, res) => {
  const { ProductID, CategoryID } = req.body;

  const query =
    "INSERT INTO Category_contains (CategoryID, ProductID) VALUES (?, ?)";
  connection.query(query, [CategoryID, ProductID], (error, results) => {
    if (error) {
      console.error("Error executing the query:", error);
      return res.status(500).send("Error executing the query");
    }

    res.json({
      message: "Product by Category created successfully",
    });
  });
});

module.exports = router;
