let express = require("express");
let bodyParser = require("body-parser");
let logger = require("morgan");

let nodemailer = require("nodemailer");

// Require all models

let PORT = process.env.PORT || 3000;

// Initialize Express
let app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));

app.use(bodyParser.json());
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("dist"));

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB

app.post("/contact", function(req, res) {
  console.log(req.body);

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_KEY
    }
  });

  let mailOptions = {
    from: `"${req.body.name}"  <${req.body.email}>`,
    to: "aboveavg55@gmail.com",
    subject: "Quote request",
    text: `from ${req.body.email}
        \nclients name ${req.body.name}
        \nphone number ${req.body.number || "N/A"}
        \naddress ${req.body.address || "N/A"} ${req.body.address2 || ""}
        \ncity: ${req.body.city || "N/A"}  state: ${req.body.state ||
      "N/A"} zip: ${req.body.zip || "N/A"}
        \nHow did they hear about you: ${req.body.reference || "N/A"}
        \nSenior Moving: ${req.body.isSenior || "off"}
        \n special instructions:  ${req.body.instructions || "N/A"}`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      res.redirect("/thankyou.html");
    }
  });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
