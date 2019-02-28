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
  Fixtures: {
    type: Array
  }
});

module.exports = Season = mongoose.model("Season", SeasonSchema, "Seasons");
