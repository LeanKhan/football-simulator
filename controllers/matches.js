const match_router = require("express").Router(),
  path = require("path"),
  Match = require("../models/match");
// mongoose = require("mongoose");

// var season = {
//   season_title: "",
//   season_code: ""
// };

var match = {};

// match_router.get("/play", (req, res) => {
//   res.sendFile(path.join(__dirname, "../view/index.html"));
// });

match_router.get("/get/matchcode", (req, res) => {
  res.send(match);
});

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

match_router.get("/play/:match_code/:match_number", (req, res) => {
  res.sendFile(path.join(__dirname, "../view/index.html"));
  // console.log(req.params.match_code);
  match.match_code = req.params.match_code;
  match.match_number = req.params.match_number;
});

module.exports = match_router;
