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

// Endpoint used to go to the stats page
views_router.get("/page/stats/:season_long_code", (req, res) => {
  res.sendFile(path.join(__dirname, "../view/stats.html"));
});

module.exports = views_router;
