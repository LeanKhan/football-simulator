const match_router = require("express").Router(),
  path = require("path"),
  Match = require("../models/match"),
  Season = require("../models/season");

// Object containing details about the match. Such as:
//  match_code e.g 'L3:S201:M4 and match_number e.g '1'
var match = {};

// Endpoint used to send the match details object to the client (frontend)
match_router.get("/get/matchcode", (req, res) => {
  res.send(match);
});

// Endpoint used to update an already existing fixture.
match_router.post("/new", (req, res) => {
  let season_code = req.query.season;
  let match_number = req.query.match_number;
  let match_code = req.query.match_code;
  let updated_match_details = req.body.match;

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
        ["Fixtures.$.AwayTeamDetails"]: updated_match_details.AwayTeamDetails,
        ["Fixtures.$.Time"]: updated_match_details.Time
      }
    },
    { useFindAndModify: false },
    (err, fixtures_list) => {
      if (!err) {
        // Save the match file and save it as a new Match record.
        res.send("Match updated successfully!");
        let fixture = fixtures_list.Fixtures[match_number];
        fixture.HomeTeamScore = updated_match_details.HomeTeamScore;
        fixture.AwayTeamScore = updated_match_details.AwayTeamScore;
        fixture.Winner = updated_match_details.Winner;
        fixture.Loser = updated_match_details.Loser;
        fixture.Played = updated_match_details.Played;
        fixture.Draw = updated_match_details.Draw;
        fixture.HomeTeamDetails = updated_match_details.HomeTeamDetails;
        fixture.AwayTeamDetails = updated_match_details.AwayTeamDetails;
        fixture.Time = updated_match_details.Time;
        saveMatch(fixture);
      } else {
        res.send("Error!");
        console.log("Error in updating fixture", err);
      }
    }
  );
});

// Function that takes an updated fixture and saves it as a new Match in the Match collection.
function saveMatch(fixture) {
  Match.findOne({ MatchCode: fixture.MatchCode }, (err, doc) => {
    if (!err) {
      if (doc) {
        updateMatch(fixture);
      } else {
        let _match = new Match(fixture);

        _match.save((err, match) => {
          if (!err) {
            console.log(`${match.Winner} created successfully! :)`);
          } else {
            console.error(err);
          }
        });
      }
    } else {
      console.log("Error in saving match", err);
    }
  });
}

// Function that updates a match
function updateMatch(fixture) {
  Match.updateOne(
    { MatchCode: fixture.MatchCode },
    {
      HomeTeamScore: fixture.HomeTeamScore,
      AwayTeamScore: fixture.AwayTeamScore,
      HomeTeamDetails: fixture.HomeTeamDetails,
      AwayTeamDetails: fixture.AwayTeamDetails,
      Time: fixture.Time
    },
    (err, doc) => {
      if (!err) {
        console.log("Match replayed successfully!", doc);
      } else {
        console.log("Error in updating match", err);
      }
    }
  );
}

// Endpoint used to save the match details before a match is played.
match_router.get("/play/:match_code/:match_number", (req, res) => {
  res.sendFile(path.join(__dirname, "../view/index.html"));
  // console.log(req.params.match_code);
  match.match_code = req.params.match_code;
  match.match_number = req.params.match_number;
});

module.exports = match_router;
