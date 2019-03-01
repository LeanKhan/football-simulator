const match_router = require("express").Router(),
  path = require("path"),
  Match = require("../models/match"),
  Season = require("../models/season");
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
  let season_code = req.query.season;
  let match_number = req.query.match_number;
  let match_code = req.query.match_code;
  let updated_match_details = req.body.match;
  let response = {};
  let new_fixture;

  console.log("Match code", req.query);

  // Find the associated season to selet the specific fixture.
  // and update it with the recieved data.

  Season.findOneAndUpdate(
    { SeasonLongCode: season_code, "Fixtures.MatchCode": match_code },
    {
      $set: {
        ["Fixtures.$.HomeTeamScore"]: updated_match_details.HomeTeamScore,
        ["Fixtures.$.AwayTeamScore"]: updated_match_details.AwayTeamScore,
        ["Fixtures.$.Winner"]: updated_match_details.Winner,
        ["Fixtures.$.Loser"]: updated_match_details.Loser,
        ["Fixtures.$.Played"]: updated_match_details.Played,
        ["Fixtures.$.Draw"]: updated_match_details.Draw,
        ["Fixtures.$.HomeTeamDetails"]: updated_match_details.HomeTeamDetails,
        ["Fixtures.$.AwayTeamDetails"]: updated_match_details.AwayTeamDetails
      }
    },
    (err, season) => {
      if (!err) {
        console.log(match_code, " ", "Match updated successfully");
        res.send("Match updated successfully!");
      } else {
        res.send("Error!");
        console.log("Error in updatign fixture", err);
      }
    }
  );

  // Season.findOne({ SeasonLongCode: season }, (err, season) => {
  //   if (!err) {
  //     let fixture = season.Fixtures[match_number];
  //     fixture.HomeTeamScore = updated_match_details.HomeTeamScore;
  //     fixture.AwayTeamScore = updated_match_details.AwayTeamScore;
  //     fixture.Winner = updated_match_details.Winner;
  //     fixture.Loser = updated_match_details.Loser;
  //     fixture.Played = updated_match_details.Played;
  //     fixture.Draw = updated_match_details.Draw;
  //     fixture.HomeTeamDetails = updated_match_details.HomeTeamDetails;
  //     fixture.AwayTeamDetails = updated_match_details.AwayTeamDetails;
  //     new_fixture = fixture;

  //   } else {
  //     console.error("Error in updating fixture", err);
  //     response.message = "Error in updating fixture";
  //     response.code = 404;
  //     // res.send(response);
  //   }
  // });

  // let _match = new Match(new_fixture);

  // _match.save((err, match) => {
  //   if (!err) {
  //     console.log(`${match.Winner} created successfully! :)`);
  //   } else {
  //     console.error(err);
  //   }
  // });

  // console.log(JSON.stringify(response));
  // res.send(response);
});

match_router.get("/play/:match_code/:match_number", (req, res) => {
  res.sendFile(path.join(__dirname, "../view/index.html"));
  // console.log(req.params.match_code);
  match.match_code = req.params.match_code;
  match.match_number = req.params.match_number;
});

module.exports = match_router;
