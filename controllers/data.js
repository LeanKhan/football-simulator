const data_router = require("express").Router(),
  path = require("path"),
  Club = require("../models/club"),
  url = require("url"),
  querystring = require("querystring"),
  Season = require("../models/season");

//   Season

var season = {
  SeasonTitle: "",
  SeasonCode: "",
  LeagueCode: "",
  SeasonLongCode: ""
};

// data_router.use("/players", players_router);

// Endpoint used to go to the tables view
// data_router.get("/table", (req, res) => {
//   res.sendFile(path.join(__dirname, "../view/league_table.html"));
// });

// Enpoint to create new Club
// data_router.post("/new/club", (req, res) => {
//   console.log(req.body);
//   let club = {
//     Name: req.body.club_name,
//     ClubCode: req.body.club_code,
//     LeagueCode: req.body.league_code,
//     AttackingClass: req.body.club_attacking_class,
//     DefensiveClass: req.body.club_defensive_class,
//     Manager: req.body.manager_name,
//     Stadium: req.body.stadium_name
//   };
//   // Save the club object in the Club collection.
//   let _club = new Club(club);
//   _club.save((err, club) => {
//     if (!err) {
//       console.log(`${club.Name} created successfully :)`);
//       res.write(`<div class="card shadow-sm">
//           <p>${club.Name} Club created successfully!</p>
//           <p><a href="/">Back to setup</a></p>
//       </div>`);
//       res.end();
//     } else {
//       console.error("Error in creating club: ", err);
//       res.write(`<div class="card shadow-sm">
//           <p>Error in creating club</p>
//           <p><a href="/">Back to setup</a></p>
//       </div>`);
//       res.end();
//     }
//   });
// });

// Endpoint to create new season
data_router.get("/new/season", (req, res) => {
  var params = querystring.parse(url.parse(req.url).query);
  season.SeasonTitle = params["season_title"];
  season.SeasonCode = params["season_code"];
  season.LeagueCode = params["league_code"];
  season.SeasonLongCode = params["league_code"] + ":" + params["season_code"];

  // Add all the players to the season
  setPlayersInSeason(params["league_code"], season.SeasonLongCode);

  // sessionStorage.setItem("season", JSON.stringify(season));
  let _season = new Season(season);
  _season.save((err, season) => {
    if (!err) {
      res.sendFile(path.join(__dirname, "../view/fixtures.html"));
    } else {
      res.send("Error in creating season :( ", err);
    }
  });
});

// Endpoint used to push players to a season
function pushPlayers(players, season_long_code) {
  Season.findOneAndUpdate(
    { SeasonLongCode: season_long_code },
    { Players: players },
    (err, doc) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Players added successfully to Season!");
      }
    }
  );
}

// Function that get's all Clubs in a particular league
function setPlayersInSeason(league_code, season_long_code) {
  players = [];
  Club.find({ LeagueCode: league_code }, (err, clubs) => {
    if (!err) {
      players = clubs.reduce((arr, club, i) => {
        p = club.Players;
        return arr.concat(p);
      }, []);
      players.forEach((player, i) => {
        player.MOTM = 0;
      });
      pushPlayers(players, season_long_code);
      // console.log("Players", players);
    } else {
      return "Error in getting clubs";
    }
  });
}

// Endpoint used to access season
data_router.get("/seasons/:season", (req, res) => {
  season.SeasonLongCode = req.params.season;
  Season.find({ SeasonLongCode: season.SeasonLongCode }, (err, season) => {
    if (season) {
      res.sendFile(path.join(__dirname, "../view/fixtures.html"));
    } else {
      res.send(path.join(__dirname, "../view/404.html"));
    }
  });
});

// // Endpoint used to go to Fixtures page
// data_router.get("/view/seasons", (req, res) => {
//   res.sendFile(path.join(__dirname, "../view/fixtures.html"));
// });

// // Endpoint used to go to the stats page
// data_router.get("/view/stats/:season_long_code", (req, res) => {
//   res.sendFile(path.join(__dirname, "../view/stats.html"));
// });

// Endpoint used to send competition details to the client.
data_router.get("/competition-details", (req, res) => {
  res.send(season);
});

// Endpoint to get all clubs in a particular league
// data_router.get("/clubs/:league", (req, res) => {
//   let league_code = req.params.league;
//   Club.find({ LeagueCode: league_code }, (err, clubs) => {
//     if (!err) {
//       res.send(clubs);
//     } else {
//       res.send("Error in getting clubs");
//     }
//   });
// });

// Endpoint to get the two clubs playing.
// data_router.get("/clubs/:home_club_code/:away_club_code", (req, res) => {
//   let home_club_code = req.params.home_club_code;
//   let away_club_code = req.params.away_club_code;
//   Club.find(
//     { ClubCode: { $in: [home_club_code, away_club_code] } },
//     (err, clubs) => {
//       if (!err) {
//         res.send(clubs);
//       }
//     }
//   );
// });

// Endpoint to save the fixtures of a season
data_router.post("/seasons/:season/fixtures", (req, res) => {
  let season_long_code = req.params.season;
  let fixtures = req.body;
  // console.log("Fixtures", req.body);
  // res.send("Fixtures seen :)");
  Season.findOneAndUpdate(
    { SeasonLongCode: season_long_code },
    { Fixtures: fixtures },
    (err, doc) => {
      if (!err) {
        res.send("Fixtures saved successfully");
      } else {
        res.send("Error in saving fixtures", err);
        console.error("Error in saving fixtures", err);
      }
    }
  );
});

// Endpoint used to send all fixtures of a particular season to the client
data_router.get("/seasons/:season/fixtures", (req, res) => {
  let season_long_code = req.params.season;
  Season.findOne({ SeasonLongCode: season_long_code }, (err, season) => {
    if (!err) {
      res.send(JSON.stringify(season.Fixtures));
    } else {
      res.send("Error in getting season fixtures", err);
      console.log("Error in getting season fixtures ", err);
    }
  });
});

// Endpoint used to send a particular season to the client
data_router.get("/get/seasons/:season", (req, res) => {
  let season_long_code = req.params.season;
  Season.findOne({ SeasonLongCode: season_long_code }, (err, season) => {
    if (!err) {
      res.send(JSON.stringify(season));
    } else {
      res.send("Error in getting season", err);
    }
  });
});

// Endpoint used to send all seasons of a particular league to the client
data_router.get("/league/:league_code/seasons", (req, res) => {
  let league_code = req.params.league_code;
  Season.find({ LeagueCode: league_code }, (err, seasons) => {
    if (!err) {
      res.send(seasons);
    } else {
      res.send("ERROR!");
      console.log("Error", err);
    }
  });
});

// Endpoint to save standings
data_router.post("/seasons/:season/standings", (req, res) => {
  let season_long_code = req.params.season;
  let standings = req.body;
  Season.findOneAndUpdate(
    { SeasonLongCode: season_long_code },
    { Standings: standings },
    (err, doc) => {
      if (!err) {
        res.send("Standings saved successfully");
      } else {
        res.send("Error in saving standings", err);
        console.error("Error in saving standings", err);
      }
    }
  );
});

// Endpoint used to update a Club's ratings at the end of a season
// data_router.post("/club/update", (req, res) => {
//   let club = req.body.club;
//   let club_code = req.query.club_code;

//   // now = new Date();

//   // console.log("From client at - " + now.toLocaleTimeString());

//   // res.send(`From server at - ${now.toLocaleTimeString()}`);

//   let new_attacking_class = ((club.TotalAC / 700) * 12).toFixed(1);
//   let new_defensive_class = ((club.TotalDC / 700) * 12).toFixed(1);

//   Club.findOneAndUpdate(
//     { ClubCode: club_code },
//     {
//       AttackingClass: new_attacking_class,
//       DefensiveClass: new_defensive_class
//     },
//     (err, doc, result) => {
//       if (!err) {
//         res.status(200).send({
//           message: club_code + " club skill points updated successfully!"
//         });
//         club.Squad.forEach((player, i) => {
//           updatePlayerSkillPoints(player.Player_ID, player, club_code);
//         });
//       } else {
//         res
//           .status(401)
//           .send({ message: "Error updating club skill points", err: err });
//         console.log("Error updating Club", err);
//       }
//     }
//   );
// });

// function updatePlayerSkillPoints(id, stats, club_code) {
//   let new_ac = stats.AttackingClass.toFixed(2);
//   let new_dc = stats.DefensiveClass.toFixed(2);
//   let new_gkc = stats.GoalkeepingClass.toFixed(2);
//   let new_age = parseInt(stats.Age) + 1;

//   let new_rating = player_functions.calculateRating(
//     stats.Position,
//     new_ac,
//     new_dc,
//     new_gkc
//   );

//   let new_value = player_functions.calculateValue(new_age, new_rating);

//   Club.update(
//     { ClubCode: club_code, "Players.Player_ID": id },
//     {
//       $inc: {
//         ["Players.$.GoalsScored"]: stats.GoalsScored,
//         ["Players.$.Assists"]: stats.Assists,
//         ["Players.$.MOTM"]: stats.MOTM
//       },
//       $set: {
//         ["Players.$.AttackingClass"]: new_ac,
//         ["Players.$.DefensiveClass"]: new_dc,
//         ["Players.$.GoalkeepingClass"]: new_gkc,
//         ["Players.$.Age"]: new_age,
//         ["Players.$.Rating"]: new_rating,
//         ["Players.$.Value"]: new_value
//       }
//     },
//     (err, doc, result) => {
//       if (!err) {
//         console.log("Player updated succesfully", id);
//       } else {
//         console.log("Error in updating player :(", err);
//       }
//     }
//   );
// }

module.exports = data_router;
