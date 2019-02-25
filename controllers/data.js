const data_router = require("express").Router(),
  path = require("path"),
  Club = require("../models/club");

data_router.get("/table", (req, res) => {
  res.sendFile(path.join(__dirname, "../view/league_table.html"));
});

// Enpoint to create new Club
data_router.post("/new/club", (req, res) => {
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

module.exports = data_router;
