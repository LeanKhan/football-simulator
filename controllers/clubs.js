const club_router = require("express").Router(),
  Club = require("../models/club"),
  players_router = require("./players"),
  player_functions = require("../utils/player");

club_router.use("/players", players_router);

// Enpoint to create new Club
club_router.post("/new/club", (req, res) => {
  console.log(req.body);
  let club = {
    Name: req.body.club_name,
    ClubCode: req.body.club_code,
    LeagueCode: req.body.league_code,
    AttackingClass: req.body.club_attacking_class,
    DefensiveClass: req.body.club_defensive_class,
    Manager: req.body.manager_name,
    Stadium: req.body.stadium_name
  };
  // Save the club object in the Club collection.
  let _club = new Club(club);
  _club.save((err, club) => {
    if (!err) {
      console.log(`${club.Name} created successfully :)`);
      res.write(`<div class="card shadow-sm">
            <p>${club.Name} Club created successfully!</p>
            <p><a href="/">Back to setup</a></p>
        </div>`);
      res.end();
    } else {
      console.error("Error in creating club: ", err);
      res.write(`<div class="card shadow-sm">
            <p>Error in creating club</p>
            <p><a href="/">Back to setup</a></p>
        </div>`);
      res.end();
    }
  });
});

// Endpoint to get all clubs in a particular league
club_router.get("/all/clubs", (req, res) => {
  let league_code = req.query.league_code;
  Club.find({ LeagueCode: league_code }, (err, clubs) => {
    if (!err) {
      res.send(clubs);
    } else {
      res.send("Error in getting clubs");
    }
  });
});

// Endpoint to get the two clubs playing.
club_router.get("/get/clubs", (req, res) => {
  let home_club_code = req.query.home_club_code;
  let away_club_code = req.query.away_club_code;
  Club.find(
    { ClubCode: { $in: [home_club_code, away_club_code] } },
    (err, clubs) => {
      if (!err) {
        res.send(clubs);
      }
    }
  );
});

// Endpoint used to update a Club's ratings at the end of a season
club_router.post("/update/club", (req, res) => {
  let club = req.body.club;
  let club_code = req.query.club_code;

  let new_attacking_class = ((club.TotalAC / 700) * 12).toFixed(1);
  let new_defensive_class = ((club.TotalDC / 700) * 12).toFixed(1);

  Club.findOneAndUpdate(
    { ClubCode: club_code },
    {
      AttackingClass: new_attacking_class,
      DefensiveClass: new_defensive_class
    },
    (err, doc, result) => {
      if (!err) {
        res.status(200).send({
          message: club_code + " club skill points updated successfully!"
        });
        club.Squad.forEach((player, i) => {
          updatePlayerSkillPoints(player.Player_ID, player, club_code);
        });
      } else {
        res
          .status(401)
          .send({ message: "Error updating club skill points", err: err });
        console.log("Error updating Club", err);
      }
    }
  );
});

function updatePlayerSkillPoints(id, stats, club_code) {
  let new_ac = stats.AttackingClass.toFixed(2);
  let new_dc = stats.DefensiveClass.toFixed(2);
  let new_gkc = stats.GoalkeepingClass.toFixed(2);
  let new_age = parseInt(stats.Age) + 1;

  let new_rating = player_functions.calculateRating(
    stats.Position,
    new_ac,
    new_dc,
    new_gkc
  );

  let new_value = player_functions.calculateValue(new_age, new_rating);

  Club.update(
    { ClubCode: club_code, "Players.Player_ID": id },
    {
      $inc: {
        ["Players.$.GoalsScored"]: stats.GoalsScored,
        ["Players.$.Assists"]: stats.Assists,
        ["Players.$.MOTM"]: stats.MOTM
      },
      $set: {
        ["Players.$.AttackingClass"]: new_ac,
        ["Players.$.DefensiveClass"]: new_dc,
        ["Players.$.GoalkeepingClass"]: new_gkc,
        ["Players.$.Age"]: new_age,
        ["Players.$.Rating"]: new_rating,
        ["Players.$.Value"]: new_value
      }
    },
    (err, doc, result) => {
      if (!err) {
        console.log("Player updated succesfully", id);
      } else {
        console.log("Error in updating player :(", err);
      }
    }
  );
}

// -------------------- //

// Endpoint to promote club...
club_router.get("/update/club/promote", (req, res) => {
  let club_code = req.query.promoted_club;

  Club.findOne({ ClubCode: club_code }, (err, club) => {
    console.log(club);
  });
});

// Endpoint to relegate club..
club_router.get("/update/club/relegate", (req, res) => {
  let club_code = req.query.relegated_club;

  Club.findOne({ ClubCode: club_code }, (err, club) => {
    console.log(club);
  });
});

// ------------------- //

module.exports = club_router;
