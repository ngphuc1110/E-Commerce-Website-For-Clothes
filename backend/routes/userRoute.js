const express = require("express");
const router = express.Router();
const connection = require("../connection");
const bcrypt = require("bcrypt");
const moment = require("moment");

// Retrieve all users
router.get("/users", (req, res) => {
  const query = "SELECT * FROM User";
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error executing the query:", error);
      return res.status(500).send("Error executing the query");
    }

    res.json(results);
  });
});

// Retrieve a user by ID
router.get("/users/:userID", (req, res) => {
  const UserID = req.params.userID;
  const query = "SELECT * FROM User WHERE UserID = ?";
  connection.query(query, [UserID], (error, results) => {
    if (error) {
      console.error("Error executing the query:", error);
      return res.status(500).send("Error executing the query");
    }

    if (results.length === 0) {
      return res.status(404).send("User not found");
    }

    res.json(results[0]);
  });
});

// Update a user by ID
router.put("/users/edit/:userID", (req, res) => {
  const userID = req.params.userID;
  const { Username, Email, Password } = req.body;

  // Hash the password using bcrypt
  const hashedPassword = bcrypt.hashSync(Password, 10);

  const query =
    "UPDATE User SET Username = ?, Email = ?, Password = ? WHERE UserID = ?";
  connection.query(
    query,
    [Username, Email, hashedPassword, userID],
    (error, result) => {
      if (error) {
        console.error("Error executing the query:", error);
        return res.status(500).send("Error executing the query");
      }

      if (result.affectedRows === 0) {
        return res.status(404).send("User not found");
      }

      res.sendStatus(200);
    }
  );
});

// Delete a user by ID
router.delete("/users/:userID", async (req, res) => {
  const userID = req.params.userID;

  try {
    // Delete items in 'order_products' table
    await executeQuery(
      "DELETE FROM order_products WHERE OrderID IN ( SELECT OrderID FROM orders WHERE UserID = ?)",
      [userID]
    );

    // Delete items in 'orders' table
    await executeQuery("DELETE FROM orders WHERE UserID = ?", [userID]);

    // Delete items in 'Cart' table
    await executeQuery("DELETE FROM cart WHERE UserID = ?", [userID]);

    // Delete user from 'User' table
    const deleteUserQuery = "DELETE FROM User WHERE UserID = ?";
    const result = await executeQuery(deleteUserQuery, [userID]);

    if (result.affectedRows === 0) {
      return res.status(404).send("User not found");
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error executing the query:", error);
    res.status(500).send("Error executing the query");
  }
});

// Helper function to execute a SQL query with parameters
function executeQuery(query, params) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

// Retrieve a user's cart by user ID
router.get("/users/:userID/cart", (req, res) => {
  const userID = req.params.userID;
  if (!userID || isNaN(userID)) {
    // userID parameter is missing, do nothing
    return;
  }
  const query = "SELECT * FROM Cart WHERE UserID = ?";
  connection.query(query, [userID], (error, results) => {
    if (error) {
      console.error("Error executing the query:", error);
      return res.status(500).send("Error executing the query");
    }

    // Assuming you have a "Cart" table that stores the user's cart information
    if (results.length === 0) {
      return res.json({ cartItems: [] });
    }

    res.json({ cartItems: results });
  });
});

// Update a user's cart by user ID
router.put("/users/:userID/cart", (req, res) => {
  const userID = req.params.userID;
  const cartItems = req.body;
  if (!userID || isNaN(userID)) {
    // userID parameter is missing, do nothing
    return;
  }
  // Delete all existing cart items for the given userID
  const deleteQuery = `DELETE FROM cart WHERE UserID = ?`;
  connection.query(deleteQuery, [userID], (error, result) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }

    // Insert new cart items for the given userID
    const insertQuery = `INSERT INTO cart (UserID, ProductID, Quantity) VALUES ?`;
    const values = cartItems.map((item) => [
      userID,
      item.ProductID,
      item.cartQuantity,
    ]);
    connection.query(insertQuery, [values], (error, result) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
        return;
      }

      // 3. Cart updated successfully
      res.sendStatus(200);
    });
  });
});

// Get User Stats
router.get("/stats", (req, res) => {
  const previousMonth = moment()
    .subtract(1, "month")
    .set("date", 7)
    .format("YYYY-MM-DD HH:mm:ss");

  const query = `
    SELECT MONTH(created_at) AS month, COUNT(*) AS total
    FROM user
    WHERE created_at >= '${previousMonth}'
    GROUP BY MONTH(created_at)
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send(error);
    } else {
      res.status(200).send(results);
    }
  });
});

module.exports = router;
