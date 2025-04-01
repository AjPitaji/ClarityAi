require("dotenv").config(); // Import dotenv to use environment variables

const express = require("express");

const app = express();
const port = 8000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/p2f", (req, res) => {
  const apiKey = process.env.apiKey; // Get the apiKey from environment variables
  res.render("p2f.ejs", { apiKey }); // Pass apiKey to the p2f.ejs template
});

app.get("/main", (req, res) => {
  const apiKey = process.env.apiKey; // Get the apiKey from environment variables
  res.render("main.ejs", { apiKey }); // Pass apiKey to the main.ejs template
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
