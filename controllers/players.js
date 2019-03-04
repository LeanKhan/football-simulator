const mongoose = require("mongoose"),
  Club = require("../models/club"),
  players_router = require("express").Router();

players_router.post("/new", (req, res) => {
  let player = req.body.Player;
  Club.update({ ClubCode: club_code }, {});
  res.send("Player created!");
});

module.exports = players_router;
