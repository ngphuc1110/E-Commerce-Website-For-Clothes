const express = require("express");
const bcrypt = require("bcrypt");
const connection = require("../connection");
const router = express.Router();
const transporter = require("../utils/emailConfig");
const crypto = require("crypto");

function generateVerificationToken() {
  const token = crypto.randomBytes(32).toString("hex");
  return token;
}

router.post("/register", (req, res) => {
  const { Username, Email, Password } = req.body;

  // Check if user with the given email already exists
  const checkQuery = "SELECT * FROM User WHERE Email = ?";
  connection.query(checkQuery, [Email], (checkError, checkResults) => {
    if (checkError) {
      console.error(checkError);
      return res.status(500).json({ message: "Failed to register user" });
    }

    if (checkResults.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // User does not exist, proceed with registration
    // Hash the password
    bcrypt.hash(Password, 10, (hashError, hashedPassword) => {
      if (hashError) {
        console.error(hashError);
        return res.status(500).json({ message: "Failed to register user" });
      }

      const user = { Username, Email, Password: hashedPassword, role: "User" };
      const insertQuery = "INSERT INTO User SET ?";
      connection.query(insertQuery, user, (insertError, insertResults) => {
        if (insertError) {
          console.error(insertError);
          return res.status(500).json({ message: "Failed to register user" });
        }

        // Generate verification token (you need to implement this)
        const verificationToken = generateVerificationToken();

        // Update the user's record with the verification token
        const updateQuery =
          "UPDATE User SET verificationToken = ? WHERE UserID = ?";
        connection.query(
          updateQuery,
          [verificationToken, insertResults.insertId],
          (updateError) => {
            if (updateError) {
              console.error(updateError);
              return res
                .status(500)
                .json({ message: "Failed to register user" });
            }

            // Construct the verification link
            const verificationLink = `http://localhost:5000/verify/${verificationToken}`;

            const mailOptions = {
              from: "duyvudrive01@gmail.com",
              to: Email,
              subject: "Account Verification",
              text: "Please click the link to verify your account.",
              html: `<p>Please click the link to verify your account: <a href="${verificationLink}">Verify Account</a></p>`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error("Error sending verification email:", error);
                return res
                  .status(500)
                  .json({ message: "Failed to send verification email" });
              }

              console.log("Verification email sent:", info.response);
              return res.status(200).json({
                message: "Registration successful. Verification email sent.",
              });
            });
          }
        );
      });
    });
  });
});

router.get("/verify/:token", async (req, res) => {
  const { token } = req.params;

  const selectQuery = "SELECT * FROM User WHERE verificationToken = ?";
  connection.query(selectQuery, [token], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to verify account" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    const user = results[0];

    const updateQuery = "UPDATE User SET isVerified = 1 WHERE UserID = ?";
    connection.query(updateQuery, [user.UserID], (updateError) => {
      if (updateError) {
        console.error(updateError);
        return res.status(500).json({ message: "Failed to verify account" });
      }

      setTimeout(() => {
        const htmlResponse = `
          <html>
            <head>
              <style>
                html, body {
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex-direction: column;
                }
                h1, h2 {
                  text-align: center;
                }
              </style>
            </head>
            <body>
              <h1>Registration successful!</h1>
              <br>
              <h2>Redirecting back to login page...</h2>
              <script>
                setTimeout(function() {
                  window.location.href = "http://localhost:3000/login";
                }, 2000);
              </script>
            </body>
          </html>
        `;
        res.send(htmlResponse);
      }, 2000);
    });
  });
});

module.exports = router;
