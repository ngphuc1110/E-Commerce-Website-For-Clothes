const express = require("express");
const router = express.Router();
const connection = require("../connection");

// Retrieve Product Query
router.get("/search/:searchItem", (req, res) => {
  const { searchItem } = req.params;
  const sql = `SELECT * FROM product WHERE Name LIKE '%${searchItem}%' OR Description LIKE '%${searchItem}%'`;
  connection.query(sql, (error, results) => {
    if (error) {
      console.error("Error executing the query:", error);
      return res.status(500).send("Error executing the query");
    }

    res.json(results);
  });
});

module.exports = router;
