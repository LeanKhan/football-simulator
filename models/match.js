const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MatchSchema = new Schema({
  MatchCode: {
    type: String,
    required: true
  },
  SeasonString: String,
  SeasonCode: String,
  LeagueString: {
    type: String
    // required: true
  },
  LeagueCode: String,
  Home: {
    type: String,
    required: true
  },
  Away: {
    type: String,
    required: true
  },
  HomeTeamScore: {
    type: Number,
    required: true
  },
  AwayTeamScore: {
    type: Number,
    required: true
  },
  Winner: String,
  Loser: String,
  Draw: {
    type: Boolean,
    default: false
  },
  Played: {
    type: Boolean,
    default: false
  },
  HomeTeamDetails: {
    ChancesCreatedRate: Number,
    ChancesCreatedNumber: Number,
    ProbabilityNumber: Number,
    DefensiveForm: Number,
    AttackingForm: Number,
    DefensiveClass: Number,
    AttackingClass: Number
  },
  AwayTeamDetails: {
    ChancesCreatedRate: Number,
    ChancesCreatedNumber: Number,
    ProbabilityNumber: Number,
    DefensiveForm: Number,
    AttackingForm: Number,
    DefensiveClass: Number,
    AttackingClass: Number
  },
  HomeSquadStats: [],
  AwaySquadStats: [],
  Time: Date,
  Stadium: String
});

module.exports = Match = mongoose.model("Match", MatchSchema, "Matches");
