// action-figure football simulation :)

var home_match_details = "";
var away_match_details = "";
var match_details_labels = "";
var fixtures = [];
var selected_fixture;
var match;
var SeasonLongCode;
var new_match;
// -------- \\

var selected_league;
var selected_league_text;
var selected_league_code;
var home_team_object;
var away_team_object;
var home_team_code;
var away_team_code;

function Team(name, attacking_class, defensive_class) {
  this.name = name;
  this.attacking_class = attacking_class;
  this.defensive_class = defensive_class;
}

Team.prototype = {
  constructor: Team
};

function Match(teamA, teamB) {
  this.teamA = {
    name: teamA.name,
    attacking_class: teamA.attacking_class,
    defensive_class: teamA.defensive_class
  };
  this.teamB = {
    name: teamB.name,
    attacking_class: teamB.attacking_class,
    defensive_class: teamB.defensive_class
  };
  this.details = {
    LeagueString: "",
    Draw: false,
    Played: false,
    Time: new Date()
  };
}

Match.prototype = {
  constructor: Match,
  calculateForm() {
    this.teamA.attacking_form = Math.round(Math.random() * 11) + 1;
    this.teamA.defensive_form = Math.round(Math.random() * 11) + 1;
    this.teamB.attacking_form = Math.round(Math.random() * 11) + 1;
    this.teamB.defensive_form = Math.round(Math.random() * 11) + 1;
  },
  startMatch() {
    this.calculateForm();
    this.match_title = this.teamA.name + " vs " + this.teamB.name;
  },
  calculateChancesCreatedRate() {
    this.teamA.CCR =
      (this.teamA.attacking_class + this.teamA.attacking_form) /
      (this.teamB.defensive_class + this.teamB.defensive_form);
    //   ---------- //
    this.teamB.CCR =
      (this.teamB.attacking_class + this.teamB.attacking_form) /
      (this.teamA.defensive_class + this.teamA.defensive_form);
  },
  calculateChancesCreatedNumber() {
    this.teamA.CCN = Math.round(this.teamA.attacking_class * this.teamA.CCR);
    this.teamB.CCN = Math.round(this.teamB.attacking_class * this.teamB.CCR);
  },
  calculateGoalsScored() {
    this.teamA.probability_number = Math.round(Math.random() * 11) + 1;
    this.teamB.probability_number = Math.round(Math.random() * 11) + 1;
    //---//
    this.teamA.goals =
      ((this.teamA.probability_number - this.teamB.defensive_form) / 12) *
        this.teamA.CCN <
      1
        ? 0
        : Math.round(
            ((this.teamA.probability_number - this.teamB.defensive_form) / 12) *
              this.teamA.CCN
          );
    this.teamB.goals =
      ((this.teamB.probability_number - this.teamA.defensive_form) / 12) *
        this.teamB.CCN <
      1
        ? 0
        : Math.round(
            ((this.teamB.probability_number - this.teamA.defensive_form) / 12) *
              this.teamB.CCN
          );
  },
  report() {
    if (this.teamA.goals == this.teamB.goals) {
      this.details.Winner = null;
      this.details.Loser = null;
      this.details.Draw = true;
    } else if (this.teamA.goals > this.teamB.goals) {
      this.details.Winner = this.teamA.name;
      this.details.Loser = this.teamB.name;
    } else {
      this.details.Winner = this.teamB.name;
      this.details.Loser = this.teamA.name;
    }
    this.details.Played = true;
    this.details.Time = new Date();
    this.details.HomeTeamScore = this.teamA.goals;
    this.details.AwayTeamScore = this.teamB.goals;

    this.details.HomeTeamDetails = {
      ChancesCreatedRate: this.teamA.CCR,
      ChancesCreatedNumber: this.teamA.CCN,
      ProbabilityNumber: this.teamA.probability_number,
      DefensiveForm: this.teamA.defensive_form,
      AttackingForm: this.teamA.attacking_form,
      DefensiveClass: this.teamA.defensive_class,
      AttackingClass: this.teamA.attacking_class
    };

    this.details.AwayTeamDetails = {
      ChancesCreatedRate: this.teamB.CCR,
      ChancesCreatedNumber: this.teamB.CCN,
      ProbabilityNumber: this.teamB.probability_number,
      DefensiveForm: this.teamB.defensive_form,
      AttackingForm: this.teamB.attacking_form,
      DefensiveClass: this.teamB.defensive_class,
      AttackingClass: this.teamB.attacking_class
    };

    home_match_details = `<b>${this.teamA.CCR}</b><br>
    <b>${this.teamA.CCN}</b><br>
    <b>${this.teamA.probability_number}</b><br>
    <b>${this.teamA.attacking_form}</b><br>
    <b>${this.teamA.defensive_form}</b><br>`;

    away_match_details = `<b>${this.teamB.CCR}</b><br>
    <b>${this.teamB.CCN}</b><br>
    <b>${this.teamB.probability_number}</b><br>
    <b>${this.teamB.attacking_form}</b><br>
    <b>${this.teamB.defensive_form}</b><br>`;

    match_details_labels = `Chances Created Rate<br>
    Chances Created Number<br>
    Probability Number<br>
    Attacking Form<br>
    Defensive Form<br>`;
  },
  simulate() {
    this.startMatch();
    this.calculateChancesCreatedRate();
    this.calculateChancesCreatedNumber();
    this.calculateGoalsScored();
    this.report();
  }
};

var view = {
  // Show teams
  displayResults(match) {
    let simulate_button = document.getElementById("simulate_button");
    var home_match_details_element = document.getElementById(
      "home_match_details"
    );
    var away_match_details_element = document.getElementById(
      "away_match_details"
    );
    var match_details_labels_element = document.getElementById(
      "match_details_labels"
    );
    var home_score = document.getElementById("home_score");
    var away_score = document.getElementById("away_score");
    var score_divider = document.getElementById("score_divider");
    if (selected_fixture.Played) {
      simulate_button.setAttribute("class", "btn btn-danger");
      simulate_button.innerHTML = "Replay";

      home_score.innerHTML = `<b>${match.HomeTeamScore}</b>`;
      away_score.innerHTML = `<b>${match.AwayTeamScore}</b>`;
      score_divider.innerHTML = "<span>-</span>";
    } else {
      home_score.innerHTML = `<b>${match.teamA.goals}</b>`;
      away_score.innerHTML = `<b>${match.teamB.goals}</b>`;
      score_divider.innerHTML = "<span>-</span>";
      match_details_labels_element.innerHTML = match_details_labels;
      home_match_details_element.innerHTML = home_match_details;
      away_match_details_element.innerHTML = away_match_details;
    }
  },
  showResults(match) {
    match.simulate();

    view.displayResults(match);
    controller.sendToServer(match);

    stats_view.displayFormation(home_players, away_players, fixture.details);
  },
  showTeams() {
    var home_team_name_element = document.getElementById("home_team_name");
    var away_team_name_element = document.getElementById("away_team_name");
    var home_team_icon = document.getElementById("home_icon");
    var away_team_icon = document.getElementById("away_icon");
    var league_detail = document.getElementById("league_detail");

    home_team_name_element.innerText = selected_fixture.Home;
    away_team_name_element.innerText = selected_fixture.Away;

    home_team_icon.innerHTML = `<img src="/img/${home_team_code}.png" height="150px" width="150px">`;
    away_team_icon.innerHTML = `<img src="/img/${away_team_code}.png" height="150px" width="150px">`;

    // League Logo
    league_detail.innerHTML = `<img src="/img/${
      SeasonLongCode.split(":")[0]
    }.png" height="72px">`;
    if (selected_fixture.Played) {
      view.displayResults(selected_fixture);
    }
    stats_model.getMatch();
  }
};
// Object containing season.season_text and season.season_code

var controller = {
  sendToServer(match_object) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(xhttp.responseText);
      }
    };

    xhttp.open(
      "POST",
      `/match/new?season=${SeasonLongCode}&match_number=${
        match.match_number
      }&match_code=${match.match_code}`,
      true
    );
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ match: match_object.details }));
  },
  getFixtureDetails() {
    let to_fixtures_link = document.getElementById("to_fixtures_link");
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        match = JSON.parse(xhttp.response);
        SeasonLongCode =
          match.match_code.split(":")[0] + ":" + match.match_code.split(":")[1];
        controller.getFixtures();
        to_fixtures_link.setAttribute(
          "href",
          `/data/seasons/${SeasonLongCode}`
        );
      }
    };

    xhttp.open("GET", "/match/get/matchcode", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
  },
  getFixtures() {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        fixtures = JSON.parse(xhttp.response);
        selected_fixture = fixtures[match.match_number];
        home_team_code = selected_fixture.HomeClubCode;
        away_team_code = selected_fixture.AwayClubCode;
        view.showTeams();
      }
    };

    xhttp.open("GET", `/data/seasons/${SeasonLongCode}/fixtures`, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
  }
};

// Select the home form

var handlers = {
  setUpEventListeners() {
    // Just for the clear button
    var home_team_name_element = document.getElementById("home_team_name");
    var away_team_name_element = document.getElementById("away_team_name");
    var home_team_icon = document.getElementById("home_icon");
    var away_team_icon = document.getElementById("away_icon");
    var home_match_details_element = document.getElementById(
      "home_match_details"
    );
    var away_match_details_element = document.getElementById(
      "away_match_details"
    );
    var match_details_labels_element = document.getElementById(
      "match_details_labels"
    );
    var home_score = document.getElementById("home_score");
    var away_score = document.getElementById("away_score");
    var score_divider = document.getElementById("score_divider");
    // Select the league and teams

    var league_detail = document.getElementById("league_detail");

    let simulate_button = document.getElementById("simulate_button");
    let clear_button = document.getElementById("clear_button");

    simulate_button.addEventListener("click", ev => {
      if (selected_fixture.Played) {
        let c = confirm(`Are you sure you want to replay this match?\n
        ${selected_fixture.Home} vs ${selected_fixture.Away}`);
        if (c) {
          selected_fixture.Played = false;
          home_team_object = new Team(
            selected_fixture.Home,
            selected_fixture.HomeTeamAC,
            selected_fixture.HomeTeamDC
          );
          away_team_object = new Team(
            selected_fixture.Away,
            selected_fixture.AwayTeamAC,
            selected_fixture.AwayTeamDC
          );
          new_match = new Match(home_team_object, away_team_object);
          selected_fixture.Played = false;
          view.showResults(new_match);
        }
      } else {
        home_team_object = new Team(
          selected_fixture.Home,
          selected_fixture.HomeTeamAC,
          selected_fixture.HomeTeamDC
        );
        away_team_object = new Team(
          selected_fixture.Away,
          selected_fixture.AwayTeamAC,
          selected_fixture.AwayTeamDC
        );
        new_match = new Match(home_team_object, away_team_object);

        view.showResults(new_match);
      }
    });
    clear_button.addEventListener("click", ev => {
      league_detail.innerHTML = "";
      home_match_details_element.innerHTML = "";
      away_match_details_element.innerHTML = "";
      match_details_labels_element.innerHTML = "";
      away_team_name_element.innerHTML = "";
      away_team_icon.innerHTML = "";
      home_team_name_element.innerHTML = "";
      home_team_icon.innerHTML = "";
      home_score.innerHTML = "";
      away_score.innerHTML = "";
      score_divider.innerHTML = "";
    });
  }
};

// Stats Side
let fixture;
let clubs;
let home_players;
let away_players;
let home_players_match;
let away_players_match;
let home = {
  gk: [],
  def: [],
  mid: [],
  att: []
};

let away = {
  gk: [],
  def: [],
  mid: [],
  att: []
};
var stats_model = {
  getMatch() {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        fixture = JSON.parse(xhttp.response);
        stats_model.getClubs();
      }
    };

    xhttp.open(
      "GET",
      `/match/get/${match.match_code}/${match.match_number}/stats`,
      true
    );
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
  },
  getClubs() {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        clubs = JSON.parse(xhttp.response);
        home_players = clubs[0].Players;
        setPlayers(home, home_players);
        away_players = clubs[1].Players;
        setPlayers(away, away_players);
        sortPlayers();
        stats_view.displayFormation();
      }
    };

    xhttp.open(
      "GET",
      `/data/clubs/${fixture.HomeClubCode}/${fixture.AwayClubCode}`,
      true
    );
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
  },
  formations: {
    home_321: [3, 15, 17, 19, 23, 25, 31],
    away_321: [66, 50, 52, 54, 44, 46, 38]
  },
  distributeStats(goals, squad_obj, squad_match_obj, TeamDetails) {
    // console.log(fixture.HomeTeamDetails);

    // Distribute Goals Scored
    for (let index = 1; index <= goals; index++) {
      let chance = Math.ceil(Math.random() * 12);
      if (chance >= 7) {
        who = Math.ceil(Math.random() * squad_obj.att.length) - 1;
        squad_obj.att[who]["GoalsScored"]++;
        squad_obj.att[who]["Points"]++;
      } else if (chance >= 4 && chance <= 8) {
        who = Math.ceil(Math.random() * squad_obj.mid.length) - 1;
        squad_obj.mid[who]["GoalsScored"]++;
        squad_obj.mid[who]["Points"]++;
      } else if (chance >= 2 && chance <= 3) {
        who = Math.ceil(Math.random() * squad_obj.def.length) - 1;
        squad_obj.def[who]["GoalsScored"]++;
        squad_obj.def[who]["Points"]++;
      } else if (chance < 2) {
        squad_obj.gk[0]["GoalsScored"]++;
        squad_obj.gk[0]["Points"]++;
      }
    }
    // Distribute Assists
    for (let index = 1; index <= goals; index++) {
      let chance = Math.ceil(Math.random() * 12);
      if (chance >= 7) {
        who = Math.ceil(Math.random() * squad_obj.mid.length) - 1;
        squad_obj.mid[who]["Assists"]++;
        squad_obj.mid[who]["Points"]++;
      } else if (chance >= 3 && chance <= 8) {
        who = Math.ceil(Math.random() * squad_obj.att.length) - 1;
        squad_obj.att[who]["Assists"]++;
        squad_obj.att[who]["Points"]++;
      } else if (chance >= 1 && chance < 3) {
        who = Math.ceil(Math.random() * squad_obj.def.length) - 1;
        squad_obj.def[who]["Assists"]++;
        squad_obj.def[who]["Points"]++;
      }
    }
    // Distribute Attacking form
    squad_obj.att.forEach((player, i) => {
      player.Points += TeamDetails.AttackingForm / 7;
    });
    squad_obj.mid.forEach((player, i) => {
      player.Points += TeamDetails.AttackingForm / 7 / 2;
      player.Points += TeamDetails.DefensiveForm / 7 / 2;
    });
    // Distribute Defensive Form
    squad_obj.def.forEach((player, i) => {
      player.Points += TeamDetails.DefensiveForm / 7;
    });
    squad_obj.gk.forEach((player, i) => {
      player.Points += TeamDetails.DefensiveForm / 7;
    });

    return squad_obj.gk.concat(squad_obj.def, squad_obj.mid, squad_obj.att);
    // home_players = home.gk.concat(home.def,home.mid,home.att);
  }
};

var stats_view = {
  displayFormation() {
    // Regular formation:
    // 1-3-2-1
    home_players_match = stats_model.distributeStats(
      selected_fixture.HomeTeamScore,
      home,
      home_players_match,
      selected_fixture.HomeTeamDetails
    );
    away_players_match = stats_model.distributeStats(
      selected_fixture.AwayTeamScore,
      away,
      away_players_match,
      selected_fixture.AwayTeamDetails
    );
    let formation_table = document.getElementsByName("formation");

    // Sort players according to position

    stats_model.formations.home_321.forEach((pos, i) => {
      let name = document.createElement("span");

      formation_table[pos].setAttribute("class", "text-center");
      formation_table[pos].setAttribute("id", "home-" + i);
      name.innerText = home_players[i].Name.split(" ")[
        home_players[i].Name.split(" ")["length"] - 1
      ];

      formation_table[
        pos
      ].innerHTML = `<img src="/img/generic_player_kit.png" height="50px">`;
      // formation_table[pos].appendChild(ball);
      formation_table[pos].appendChild(name);
      // formation_table[pos].innerText = away_players[i].ShirtNumber;
      if (home_players[i].GoalsScored > 0) {
        var ball = document.createElement("img");
        ball.setAttribute("src", "/img/ball.png");
        ball.setAttribute("class", "ball icon");
        formation_table[pos].appendChild(ball);
        console.log(home_players[i].Name);
      }
    });

    stats_model.formations.away_321.forEach((pos, i) => {
      let name = document.createElement("span");

      formation_table[pos].setAttribute("class", "text-center");
      formation_table[pos].setAttribute("id", "home-" + i);
      name.innerText = away_players[i].Name.split(" ")[
        away_players[i].Name.split(" ")["length"] - 1
      ];

      formation_table[
        pos
      ].innerHTML = `<img src="/img/generic_player_kit.png" height="50px">`;
      // formation_table[pos].appendChild(ball);
      formation_table[pos].appendChild(name);
      // formation_table[pos].innerText = away_players[i].ShirtNumber;
      if (away_players[i].GoalsScored > 0) {
        var ball = document.createElement("img");
        ball.setAttribute("src", "/img/ball.png");
        ball.setAttribute("class", "ball icon");
        formation_table[pos].appendChild(ball);
        console.log(away_players[i].Name);
      }
    });
  }
};

function setPlayers(obj, array) {
  array.forEach((pl, i) => {
    if (pl.PositionNumber == 1) {
      pl.Points = 0;
      obj.gk.push(pl);
    } else if (pl.PositionNumber == 2) {
      pl.Points = 0;
      obj.def.push(pl);
    } else if (pl.PositionNumber == 3) {
      pl.Points = 0;
      obj.mid.push(pl);
    } else if (pl.PositionNumber == 4) {
      pl.Points = 0;
      obj.att.push(pl);
    }
  });
}

function sortPlayers() {
  home_players.sort((a, b) => {
    return a.PositionNumber - b.PositionNumber;
  });
  away_players.sort((a, b) => {
    return a.PositionNumber - b.PositionNumber;
  });
}

// 10-02-19 11pm
/**
 * Next: Add UI and add clubs directly.
 */
handlers.setUpEventListeners();
controller.getFixtureDetails();
