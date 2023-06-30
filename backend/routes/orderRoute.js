const express = require("express");
const router = express.Router();
const connection = require("../connection");
const moment = require("moment");

// Get Orders
router.get("/orders", async (req, res) => {
  const query = req.query.new;

  try {
    let sqlQuery = `SELECT * FROM orders ORDER BY OrderID`;

    connection.query(sqlQuery, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send(error);
      } else {
        res.status(200).send(results);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Retrieve a specific order by ID
router.get("/orders/:OrderID", (req, res) => {
  const OrderID = req.params.OrderID;
  const query = "SELECT * FROM orders WHERE OrderID = ?";
  connection.query(query, [OrderID], (error, results) => {
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

// Update a specific order by ID
router.put("/orders/:OrderID", (req, res) => {
  const OrderID = req.params.OrderID;
  const updatedOrder = req.body;

  const query = "UPDATE orders SET ? WHERE OrderID = ?";
  connection.query(query, [updatedOrder, OrderID], (error, results) => {
    if (error) {
      console.error("Error executing the query:", error);
      return res.status(500).send("Error executing the query");
    }

    if (results.affectedRows === 0) {
      return res.status(404).send("Order not found");
    }

    res.status(200).send("Order updated successfully");
  });
});

// Retrieve an order details by ID
router.get("/orders/details/:OrderID", (req, res) => {
  const OrderID = req.params.OrderID;

  // Fetch order details
  const orderQuery = "SELECT * FROM orders WHERE OrderID = ?";
  connection.query(orderQuery, [OrderID], (error, orderResults) => {
    if (error) {
      console.error("Error executing the query:", error);
      return res.status(500).send("Error executing the query");
    }

    if (orderResults.length === 0) {
      return res.status(404).send("Order not found");
    }

    const order = orderResults[0];

    // Fetch product details
    const productQuery = `
      SELECT p.Name, op.Quantity
      FROM order_products op
      INNER JOIN product p ON op.ProductID = p.ProductID
      WHERE op.OrderID = ?
    `;
    connection.query(productQuery, [OrderID], (error, productResults) => {
      if (error) {
        console.error("Error executing the query:", error);
        return res.status(500).send("Error executing the query");
      }

      const products = productResults.map((product) => ({
        Name: product.Name,
        Quantity: product.Quantity,
      }));

      // Combine order and product details
      const orderDetails = {
        Delivery_Status: order.Delivery_Status,
        Products: products,
        Total: order.Total,
        Shipping: order.Shipping,
        Address: order.Address,
      };

      res.json(orderDetails);
    });
  });
});

// Get Recent Orders
router.get("/orders/transactions/recent", async (req, res) => {
  const query = `SELECT * FROM orders ORDER BY OrderID DESC LIMIT 4`;
  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send(error);
    } else {
      res.status(200).send(results);
    }
  });
});

// Get Order Stats
router.get("/orderstats", (req, res) => {
  const previousMonth = moment()
    .subtract(1, "month")
    .set("date", 7)
    .format("YYYY-MM-DD HH:mm:ss");

  const query = `
      SELECT MONTH(Created_At) AS month, COUNT(*) AS total
      FROM orders
      WHERE Created_At >= '${previousMonth}'
      GROUP BY MONTH(Created_At)
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

// Get Earning Stats
router.get("/earningstats", (req, res) => {
  const previousMonth = moment()
    .subtract(1, "month")
    .set("date", 7)
    .format("YYYY-MM-DD HH:mm:ss");

  const query = `
        SELECT Sum(Total) AS total, MONTH(Created_At) AS month
        FROM orders
        WHERE Created_At >= '${previousMonth}'
        GROUP BY MONTH(Created_At)
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

// Get 1 Week Sales
router.get("/weekstats", (req, res) => {
  const last7Days = moment().subtract(7, "days").format("YYYY-MM-DD HH:mm:ss");

  const query = `
      SELECT SUM(Total) AS total, DAYOFWEEK(Created_At) AS dayOfWeek
      FROM orders
      WHERE Created_At >= '${last7Days}'
      GROUP BY DAYOFWEEK(Created_At)
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

// Get All Time Data
router.get("/topstats", async (req, res) => {
  try {
    const query = `
      SELECT o.Total, o.OrderID, o.Shipping, SUM(op.Quantity) AS TotalQuantity
      FROM orders o
      INNER JOIN order_products op ON o.OrderID = op.OrderID
      INNER JOIN product p ON op.ProductID = p.ProductID
      GROUP BY o.OrderID
      ORDER BY o.Total DESC
      LIMIT 1;
    `;

    connection.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send(error);
      } else {
        res.status(200).send(results);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
