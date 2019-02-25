const match_router = require("express").Router(),
  path = require("path"),
  Match = require("../models/match");
// mongoose = require("mongoose");

// var season = {
//   season_title: "",
//   season_code: ""
// };

match_router.get("/play", (req, res) => {
  res.sendFile(path.join(__dirname, "../view/index.html"));
});

// match_router.get("/title", (req, res) => {
//   res.send(season);
// });

match_router.post("/new", (req, res) => {
  // console.log("Details",req.body.match);

  let _match = new Match(req.body.match);

  _match.save((err, match) => {
    if (!err) {
      console.log(`${match.Winner} created successfully! :)`);
    } else {
      console.error(err);
    }
  });

  res.send("Match created successfully :)");
});

module.exports = match_router;
