const mongoose = require("mongoose"),
  Club = require("../models/club"),
  players_router = require("express").Router(),
  player_functions = require("../utils/player");

players_router.get("/new", (req, res) => {
  let rating;
  let value;
  let pos_number;

  rating = player_functions.calculateRating(
    req.query.position,
    req.query.attacking_class,
    req.query.defensive_class,
    req.query.gk_class
  );
  value = player_functions.calculateValue(req.query.age, rating);
  pos_number = player_functions.setPositionNumber(req.query.position);

  let player = {
    ClubCode: req.query.club_code,
    Position: req.query.position,
    FirstName: req.query.fname,
    LastName: req.query.lname,
    Age: req.query.age,
    ShirtNumber: req.query.shirt_number,
    AttackingClass: req.query.attacking_class,
    DefensiveClass: req.query.defensive_class,
    GoalkeepingClass: req.query.gk_class,
    Value: value,
    Rating: rating,
    GoalsScored: "",
    Assists: "",
    CleanSheets: "",
    PositionNumber: pos_number
  };
  club_code = player.ClubCode;
  Club.findOneAndUpdate(
    { ClubCode: club_code },
    { $push: { Players: player } },
    (err, doc, result) => {
      if (!err) {
        res.send(`<a href="/">Back to main page</a>`);
        console.log(doc);
      } else {
        res.send("Could not add player :(", err);
      }
    }
  );
});

module.exports = players_router;
