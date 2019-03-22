const mongoose = require("mongoose"),
  Club = require("../models/club"),
  Season = require("../models/season"),
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
    GoalsScored: 0,
    Assists: 0,
    CleanSheets: 0,
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

players_router.post("/update", (req, res) => {
  let home_squad_stats = req.body.home_squad_stats;
  let away_squad_stats = req.body.away_squad_stats;

  let season_long_code = req.query.season;

  var response = {};

  home_squad_stats.forEach((player, i) => {
    response.message = updatePlayerStats(
      player.Player_ID,
      season_long_code,
      player
    );
  });

  away_squad_stats.forEach((player, id) => {
    updatePlayerStats(player.Player_ID, season_long_code, player);
  });

  res.send(response).status(200);
});

function updatePlayerStats(id, season_long_code, stats) {
  let response;
  Season.update(
    { SeasonLongCode: season_long_code, "Players.Player_ID": id },
    {
      $inc: {
        ["Players.$.GoalsScored"]: stats.GoalsScored,
        ["Players.$.Assists"]: stats.Assists,
        ["Players.$.Points"]: stats.Points,
        ["Players.$.CleanSheets"]: stats.CleanSheets,
        ["Players.$.MOTM"]: stats.MOTM == true ? 1 : 0
      }
    },
    (err, doc) => {
      if (err) {
        console.log("Error!", err);
        response = "Error in updating player stats" + err;
      } else if (!err) {
        response = "Player stats updated successfully!";
      }
    }
  );

  return response;
}

module.exports = players_router;
