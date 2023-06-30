const express = require("express");
const router = express.Router();
const connection = require("../connection");
const util = require("util");
const queryPromise = util.promisify(connection.query).bind(connection);
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const bodyParser = require("body-parser");
router.use(bodyParser.raw({ type: "application/json" }));

router.post("/create-checkout-session", async (req, res) => {
  const customer = await stripe.customers.create({
    metadata: {
      userID: req.body.userID,
      cart: JSON.stringify(req.body.cartItems),
    },
  });

  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "vnd",
        product_data: {
          name: item.Name,
          images: [item.Image],
          description: item.Description,
          metadata: {
            id: item.ProductID,
          },
        },
        unit_amount: item.Price,
      },
      quantity: item.cartQuantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "VN"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "vnd",
          },
          display_name: "Free shipping",
          // Delivers between 5-7 business days
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 50000,
            currency: "vnd",
          },
          display_name: "Next day air",
          // Delivers in exactly 1 business day
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    customer: customer.id,
    line_items,
    payment_method_types: ["card"],
    mode: "payment",
    success_url: "http://localhost:3000/checkout-success",
    cancel_url: "http://localhost:3000/cart",
  });

  res.send({ url: session.url });
});

// Create Order
const createOrder = async (customer, data) => {
  const cartItems = JSON.parse(customer.metadata.cart);

  const orderData = {
    UserID: customer.metadata.userID,
    SubTotal: data.amount_subtotal,
    Total: data.amount_total,
    Shipping: JSON.stringify(data.customer_details),
    Payment_Status: data.payment_status,
  };

  try {
    // Insert order into the 'order' table
    const orderQuery = "INSERT INTO orders SET ?";
    const orderResult = await queryPromise(orderQuery, orderData);

    const insertId = orderResult.insertId;
    console.log("Inserted ID:", insertId);

    // Use the insertId to insert products into the 'order_products' table
    const productQuery =
      "INSERT INTO `order_products`(OrderID, ProductID, Quantity) VALUES ?";
    const products = cartItems.map((item) => {
      return [insertId, item.ProductID, item.cartQuantity];
    });

    const productResult = await queryPromise(productQuery, [products]);
    console.log("Products inserted:", productResult.affectedRows);
  } catch (error) {
    console.error(error);
  }
};

// Stripe webhook
let endpointSecret;
endpointSecret = process.env.STRIPE_WEB_HOOK;
router.post("/webhook", (request, response) => {
  const sig = request.headers["stripe-signature"];
  const payload = request.rawBody;

  let data;
  let eventType;

  if (endpointSecret) {
    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
      console.log("Webhook Verified.");
    } catch (err) {
      console.log(`Webhook Failed: ${err.message}`);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    data = event.data.object;
    eventType = event.type;
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }

  if (eventType === "checkout.session.completed") {
    stripe.customers
      .retrieve(data.customer)
      .then((customer) => {
        createOrder(customer, data);
      })
      .catch((err) => console.log(err.message));
  }

  response.send().end();
});

module.exports = router;
