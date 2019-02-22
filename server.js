const express = require("express"),
  app = express(),
  path = require("path"),
  bodyparser = require("body-parser"),
  router = express.Router();

app.use(require("cors")());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/scripts")));
app.use(express.static(path.join(__dirname, "/assets")));

app.use("/", router);

router.get("/home", (req, res) => {
  // res.writeHead(200, { "Content-Type": "text/html" });
  res.sendFile(path.join(__dirname, "view/index.html"));
});

router.post("/hey", (req, res) => {
  let name = req.body.name;
  console.log("Hello " + name);
  res.send("Seen!")
});

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "view/404.html"));
});

app.listen("4200", "localhost", () => {
  console.log("Server started successfully :)");
});
