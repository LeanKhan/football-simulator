const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ClubSchema = new Schema({
  Name: {
    type: String,
    required: true
  },
  ClubCode: {
    type: String,
    required: true
  },
  AttackingClass: {
    type: Number,
    required: true
  },
  DefensiveClass: {
    type: Number,
    required: true
  },
  Manager: String,
  Stadium: String,
  LeagueCode: String
});

module.exports = Club = mongoose.model("Club", ClubSchema, "Clubs");
