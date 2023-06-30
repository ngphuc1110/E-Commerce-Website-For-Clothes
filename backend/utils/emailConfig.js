const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "duyvudrive01@gmail.com",
    pass: "ktdczgvabkfpappa",
  },
});

module.exports = transporter;
