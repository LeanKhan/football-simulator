const data_router = require("express").Router(),
  path = require("path"),
  Club = require("../models/club"),
  url = require("url"),
  querystring = require("querystring"),
  Season = require("../models/season");

//   Season

var season = {
  season_title: "",
  season_code: "",
  league_code: ""
};

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

data_router.get("/new/season", (req, res) => {
  var params = querystring.parse(url.parse(req.url).query);
  let season_stuff = {
    SeasonTitle: params["season_title"],
    SeasonCode: params["season_code"],
    LeagueCode: params["league_code"]
  };
  season.season_title = params["season_title"];
  season.season_code = params["season_code"];
  season.league_code = params["league_code"];
  let _season = new Season(season_stuff);
  _season.save((err, season) => {
    if (!err) {
      //   res.send("Season Created Successfully");
      res.sendFile(path.join(__dirname, "../view/fixtures.html"));
    } else {
      res.send("Error in creating season :( ", err);
    }
  });
});

data_router.post("/competition-details", (req, res) => {
  res.send(season);
});

data_router.get("/clubs/:league",(req,res)=>{
    let league_code = req.params.league;
    Club.find({LeagueCode: league_code},(err,clubs)=>{
        if(!err){
            res.send(clubs);
        }else{
            res.send("Error in getting clubs")
        }
    });
})
module.exports = data_router;
