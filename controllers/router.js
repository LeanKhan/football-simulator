const router = require("express").Router(),
  path = require("path"),
  match_router = require("../controllers/matches"),
  data_router = require("../controllers/data"),
  club_router = require("../controllers/clubs"),
  views_router = require("../controllers/views");

// Routes..

router.get("/", (req, res) => {
  res.redirect("/views/home");
});

// View Router
router.use("/views", views_router);

// Match Router
router.use("/match", match_router);

// Data Router
router.use("/data", data_router);

// Club Router
router.use("/clubs", club_router);

// 404 Page
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../view/404.html"));
});

module.exports = router;
