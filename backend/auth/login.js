const express = require("express");
const bcrypt = require("bcrypt");
const connection = require('../connection');
const router = express.Router();

router.post("/login", (req, res) => {
  const { Username, Password } = req.body;

  // Check if the provided username and password match a user in the database
  const query = "SELECT * FROM User WHERE Username = ?";
  connection.query(query, [Username], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to login" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = results[0];

    // Compare the provided password with the stored hashed password
    bcrypt.compare(Password, user.Password, (error, isMatch) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to login" });
      }

      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      // User exists and credentials are correct
      // Generate a token or perform any additional actions here

      res.status(200).json({ message: "Login successful", UserID: user.UserID, Role: user.Role });
    });
  });
});

module.exports = router;
