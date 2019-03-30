const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SeasonSchema = new Schema({
  SeasonLongCode: String,
  SeasonTitle: {
    type: String,
    required: true
  },
  SeasonCode: {
    type: String,
    required: true
  },
  LeagueCode: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: new Date()
  },
  Fixtures: {
    type: Array
  },
  Standings: {
    type: Array
  },
  Players: {
    type: Array
  }
});

module.exports = Season = mongoose.model("Season", SeasonSchema, "Seasons");
