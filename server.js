const express = require("express"),
  app = express(),
  path = require("path"),
  bodyparser = require("body-parser"),
  router = express.Router();

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

app.use("/", router);

router.get("/home", (req, res) => {
  // res.writeHead(200, { "Content-Type": "text/html" });
  res.sendFile(path.join(__dirname, "view/index.html"));
});

router.post("/new-match", (req, res) => {
  let match_details = req.body.match;
  console.log(match_details);
  res.send("Seen!");
});

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "view/404.html"));
});

app.listen("4200", "localhost", () => {
  console.log("Server started successfully :)");
});
