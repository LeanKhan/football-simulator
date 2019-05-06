const views_router = require("express").Router(),
  path = require("path");

// Router to setup page...
views_router.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "../view/setup.html"));
});

views_router.get("/page/table", (req, res) => {
  res.sendFile(path.join(__dirname, "../view/league_table.html"));
});

// Endpoint used to go to Fixtures page
views_router.get("/page/seasons", (req, res) => {
  res.sendFile(path.join(__dirname, "../view/fixtures.html"));
});

// Endpoint used to go to the Stats page
views_router.get("/page/stats/:season_long_code", (req, res) => {
  res.sendFile(path.join(__dirname, "../view/stats.html"));
});

// Endpoint used to go to the Transfer page
views_router.get("/page/transfer-hub", (req, res) => {
  res.sendFile(path.join(__dirname, "../view/transfer.html"));
});

module.exports = views_router;
