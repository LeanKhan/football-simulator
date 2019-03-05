const mongoose = require("mongoose"),
  Club = require("../models/club"),
  players_router = require("express").Router();

players_router.get("/new", (req, res) => {
  let rating;
  let value;
  if (req.query.position == "ATT") {
    rating = Math.round(
      (req.query.attacking_class / 99) * 80 +
        (((req.query.defensive_class / 99) * 20) / 100) * 99
    );
  } else if (req.query.position == "DEF") {
    rating =
      // (75/99*80) + (50/99*20)/100 * 99
      Math.round(
        (req.query.defensive_class / 99) * 80 +
          (((req.query.attacking_class / 99) * 20) / 100) * 99
      );
  } else if (req.query.position == "MID") {
    rating = Math.round(
      (req.query.defensive_class / 99) * 50 +
        (((req.query.attacking_class / 99) * 50) / 100) * 99
    );
  } else if (req.query.position == "GK") {
    rating = Math.round(
      (req.query.gk_class / 99) * 90 +
        (req.query.defensive_class / 99) * 5 +
        (((req.query.attacking_class / 99) * 5) / 100) * 99
    );
  }
  let player = {
    ClubCode: req.query.club_code,
    Position: req.query.position,
    Name: req.query.name,
    Age: req.query.age,
    ShirtNumber: req.query.shirt_number,
    AttackingClass: req.query.attacking_class,
    DefensiveClass: req.query.defensive_class,
    GoalkeepingClass: req.query.gk_class,
    Value: "",
    Rating: rating,
    GoalsScored: "",
    Assists: "",
    CleanSheets: ""
  };
  club_code = player.ClubCode;
  Club.findOneAndUpdate(
    { ClubCode: club_code },
    { $push: { Players: player } },
    (err, doc, result) => {
      if (!err) {
        res.send(`<a href="/">Back to main page</a>`);
        console.log(doc);
        console.log(result);
      } else {
        res.send("Could not add player :(", err);
      }
    }
  );
});

module.exports = players_router;
