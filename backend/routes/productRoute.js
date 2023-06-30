const express = require("express");
const router = express.Router();
const connection = require("../connection");
const cloudinary = require("../utils/cloudinary");

// Create a new product
router.post("/products", async (req, res) => {
  const { name, price, description, image } = req.body;

  if (image) {
    try {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "OnlineShop",
      });

      const imageUrl = uploadRes.secure_url;

      const query =
        "INSERT INTO Product (Name, Price, Description, Image) VALUES (?, ?, ?, ?)";
      connection.query(
        query,
        [name, price, description, imageUrl],
        (error, results) => {
          if (error) {
            console.error("Error executing the query:", error);
            return res.status(500).send("Error executing the query");
          }

          res.json({
            message: "Product created successfully",
            productId: results.insertId,
          });
        }
      );
    } catch (error) {
      console.error("Error uploading the image:", error);
      return res.status(500).send("Error uploading the image");
    }
  } else {
    const query =
      "INSERT INTO Product (Name, Price, Description, Image) VALUES (?, ?, ?, ?)";
    connection.query(
      query,
      [name, price, description, null],
      (error, results) => {
        if (error) {
          console.error("Error executing the query:", error);
          return res.status(500).send("Error executing the query");
        }

        res.json({
          message: "Product created successfully",
          productId: results.insertId,
        });
      }
    );
  }
});

// Retrieve all products
router.get("/products", (req, res) => {
  const query = "SELECT * FROM Product";
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error executing the query:", error);
      return res.status(500).send("Error executing the query");
    }

    res.json(results);
  });
});

// Retrieve a specific product by ID
router.get("/products/:productID", (req, res) => {
  const productID = req.params.productID;
  const query = "SELECT * FROM Product WHERE ProductID = ?";
  connection.query(query, [productID], (error, results) => {
    if (error) {
      console.error("Error executing the query:", error);
      return res.status(500).send("Error executing the query");
    }

    if (results.length === 0) {
      return res.status(404).send("Product not found");
    }

    res.json(results[0]);
  });
});

// Update a specific product by ID
router.put("/products/:productID", async (req, res) => {
  const productID = req.params.productID;
  const { name, price, description, image } = req.body;

  try {
    let imageUrl = null;
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "OnlineShop",
      });
      imageUrl = uploadRes.secure_url;
    } else {
      const selectQuery = "SELECT Image FROM Product WHERE ProductID = ?";
      connection.query(selectQuery, [productID], (error, results) => {
        if (error) {
          console.error("Error executing the query:", error);
          return res.status(500).send("Error executing the query");
        }

        if (results.length === 0) {
          return res.status(404).send("Product not found");
        }

        imageUrl = results[0].Image;
      });
    }

    const updateQuery =
      "UPDATE Product SET Name = ?, Price = ?, Description = ?, Image = ? WHERE ProductID = ?";
    connection.query(
      updateQuery,
      [name, price, description, imageUrl, productID],
      (error, results) => {
        if (error) {
          console.error("Error executing the query:", error);
          return res.status(500).send("Error executing the query");
        }

        if (results.affectedRows === 0) {
          return res.status(404).send("Product not found");
        }

        res.sendStatus(204);
      }
    );
  } catch (error) {
    console.error("Error updating the product:", error);
    return res.status(500).send("Error updating the product");
  }
});

router.delete("/products/:productID", (req, res) => {
  const productID = req.params.productID;

  const categoryContainsQuery =
    "DELETE FROM category_contains WHERE ProductID = ?";
  connection.query(
    categoryContainsQuery,
    [productID],
    (error, categoryContainsResults) => {
      if (error) {
        console.error("Error executing the category_contains query:", error);
        return res
          .status(500)
          .send("Error executing the category_contains query");
      }

      if (categoryContainsResults.affectedRows === 0) {
        return res
          .status(404)
          .send("Product not found in the category_contains table");
      }

      const productQuery = "DELETE FROM Product WHERE ProductID = ?";
      connection.query(productQuery, [productID], (error, productResults) => {
        if (error) {
          console.error("Error executing the product query:", error);
          return res.status(500).send("Error executing the product query");
        }

        if (productResults.affectedRows === 0) {
          return res.status(404).send("Product not found");
        }

        res.sendStatus(204);
      });
    }
  );
});

module.exports = router;
