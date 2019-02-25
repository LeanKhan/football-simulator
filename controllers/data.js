const data_router = require("express").Router(),
  path = require("path");

data_router.get("/table", (req, res) => {
  res.sendFile(path.join(__dirname, "../view/league_table.html"));
});

data_router.post("/new/club", (req, res) => {});

module.exports = data_router;
