const express = require("express"),
  app = express(),
  path = require("path"),
  bodyparser = require("body-parser"),
  router = express.Router(),
  mongoose = require("mongoose"),
  match_router = require("./controllers/matches"),
  data_router = require("./controllers/data");

app.use(require("cors")());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// tell express where our static files are. Images are in assets
/**
 * TODO:
 * Move the /img and /scripts folder to /public
 */
app.use(express.static(path.join(__dirname, "/scripts")));
app.use(express.static(path.join(__dirname, "/assets")));

// MongoDB Database Connection

mongoose.connect("mongodb://localhost:27017/football-simulator", {
  useNewUrlParser: true
});

mongoose.connection.on("error", () => {
  console.log("Error in connection to database");
});

mongoose.connection.once("open", () => {
  console.log("Connection to database successful! :)");
});

app.use("/", router);
app.use("/match", match_router);
app.use("/data",data_router);

router.get("/", (req, res) => {
  // res.writeHead(200, { "Content-Type": "text/html" });
  res.sendFile(path.join(__dirname, "view/setup.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "view/404.html"));
});

app.listen("4200", "localhost", () => {
  console.log("Server started successfully :)");
});
