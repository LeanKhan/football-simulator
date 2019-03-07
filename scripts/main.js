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
    // Get elements
    let ccr_label = document.getElementById("ccr_label"),
      ccn_label = document.getElementById("ccn_label"),
      pn_label = document.getElementById("pn_label"),
      af_label = document.getElementById("af_label"),
      df_label = document.getElementById("df_label"),
      home_ccr = document.getElementById("home_ccr"),
      away_ccr = document.getElementById("away_ccr"),
      home_ccn = document.getElementById("home_ccn"),
      home_pn = document.getElementById("home_pn"),
      away_pn = document.getElementById("away_pn"),
      home_af = document.getElementById("away_af"),
      away_af = document.getElementById("home_af"),
      home_df = document.getElementById("home_df"),
      away_df = document.getElementById("away_df");

    ccr_label.setAttribute("class", "text-muted");
    ccn_label.setAttribute("class", "text-muted");
    pn_label.setAttribute("class", "text-muted");
    af_label.setAttribute("class", "text-muted");
    df_label.setAttribute("class", "text-muted");

    ccr_label.innerText = "Chances Created Rate";
    ccn_label.innerText = "Chances Created Number";
    pn_label.innerText = "Probability Number";
    af_label.innerText = "Attacking Form";
    df_label.innerText = "Defensive Form";

    // CCR Values
    home_ccr_value = Math.round(
      (match.HomeTeamDetails.ChancesCreatedRate /
        (match.HomeTeamDetails.ChancesCreatedRate +
          match.AwayTeamDetails.ChancesCreatedRate)) *
        100
    );
    away_ccr_value = Math.round(
      (match.AwayTeamDetails.ChancesCreatedRate /
        (match.HomeTeamDetails.ChancesCreatedRate +
          match.AwayTeamDetails.ChancesCreatedRate)) *
        100
    );

    // CCN Values
    home_ccn_value = Math.round(
      (match.HomeTeamDetails.ChancesCreatedNumber /
        (match.HomeTeamDetails.ChancesCreatedNumber +
          match.AwayTeamDetails.ChancesCreatedNumber)) *
        100
    );
    away_ccn_value = Math.round(
      (match.AwayTeamDetails.ChancesCreatedNumber /
        (match.HomeTeamDetails.ChancesCreatedNumber +
          match.AwayTeamDetails.ChancesCreatedNumber)) *
        100
    );

    // Probability Number Values
    home_pn_value = Math.round(
      (match.HomeTeamDetails.ProbabilityNumber /
        (match.HomeTeamDetails.ProbabilityNumber +
          match.AwayTeamDetails.ProbabilityNumber)) *
        100
    );
    away_pn_value = Math.round(
      (match.AwayTeamDetails.ProbabilityNumber /
        (match.HomeTeamDetails.ProbabilityNumber +
          match.AwayTeamDetails.ProbabilityNumber)) *
        100
    );

    // Attacking Form Values
    home_af_value = Math.round(
      (match.HomeTeamDetails.AttackingForm /
        (match.HomeTeamDetails.AttackingForm +
          match.AwayTeamDetails.AttackingForm)) *
        100
    );
    away_af_value = Math.round(
      (match.AwayTeamDetails.AttackingForm /
        (match.HomeTeamDetails.AttackingForm +
          match.AwayTeamDetails.AttackingForm)) *
        100
    );

    // Defensive Form Values
    home_df_value = Math.round(
      (match.HomeTeamDetails.DefensiveForm /
        (match.HomeTeamDetails.DefensiveForm +
          match.AwayTeamDetails.DefensiveForm)) *
        100
    );
    away_df_value = Math.round(
      (match.AwayTeamDetails.DefensiveForm /
        (match.HomeTeamDetails.DefensiveForm +
          match.AwayTeamDetails.DefensiveForm)) *
        100
    );

    var match_details_labels_element = document.getElementById(
      "match_details_labels"
    );
    var home_score = document.getElementById("home_score");
    var away_score = document.getElementById("away_score");
    var score_divider = document.getElementById("score_divider");

    // if (selected_fixture.Played) {
    simulate_button.setAttribute("class", "btn btn-danger");
    simulate_button.innerHTML = "Replay";

    home_score.innerHTML = `<b>${match.HomeTeamScore}</b>`;
    away_score.innerHTML = `<b>${match.AwayTeamScore}</b>`;
    score_divider.innerHTML = "<span>-</span>";

    // Oya na!
    // Chances Created Rate
    home_ccr.setAttribute("class", "progress-bar home-progress-bar");
    home_ccr.setAttribute("style", `width: ${home_ccr_value}%`);
    home_ccr.innerText = match.HomeTeamDetails.ChancesCreatedRate;

    away_ccr.setAttribute("class", "progress-bar away-progress-bar");
    away_ccr.setAttribute("style", `width: ${away_ccr_value}%`);
    away_ccr.innerText = match.AwayTeamDetails.ChancesCreatedRate;

    // Chances Created Number
    home_ccn.setAttribute("class", "progress-bar home-progress-bar");
    home_ccn.setAttribute("style", `width: ${home_ccn_value}%`);
    home_ccn.innerText = match.HomeTeamDetails.ChancesCreatedNumber;

    away_ccn.setAttribute("class", "progress-bar away-progress-bar");
    away_ccn.setAttribute("style", `width: ${away_ccn_value}%`);
    away_ccn.innerText = match.AwayTeamDetails.ChancesCreatedNumber;

    // Probability Number
    home_pn.setAttribute("class", "progress-bar home-progress-bar");
    home_pn.setAttribute("style", `width: ${home_pn_value}%`);
    home_pn.innerText = match.HomeTeamDetails.ProbabilityNumber;

    away_pn.setAttribute("class", "progress-bar away-progress-bar");
    away_pn.setAttribute("style", `width: ${away_pn_value}%`);
    away_pn.innerText = match.AwayTeamDetails.ProbabilityNumber;

    // Attacking Form
    home_af.setAttribute("class", "progress-bar home-progress-bar");
    home_af.setAttribute("style", `width: ${home_af_value}%`);
    home_af.innerText = match.HomeTeamDetails.AttackingForm;

    away_af.setAttribute("class", "progress-bar away-progress-bar");
    away_af.setAttribute("style", `width: ${away_af_value}%`);
    away_af.innerText = match.AwayTeamDetails.AttackingForm;

    // Defensive Form
    home_df.setAttribute("class", "progress-bar home-progress-bar");
    home_df.setAttribute("style", `width: ${home_df_value}%`);
    home_df.innerText = match.HomeTeamDetails.DefensiveForm;

    away_df.setAttribute("class", "progress-bar away-progress-bar");
    away_df.setAttribute("style", `width: ${away_df_value}%`);
    away_df.innerText = match.AwayTeamDetails.DefensiveForm;
    // } else {
    //   home_score.innerHTML = `<b>${match.teamA.goals}</b>`;
    //   away_score.innerHTML = `<b>${match.teamB.goals}</b>`;
    //   score_divider.innerHTML = "<span>-</span>";
    // }
  },
  showResults(match) {
    match.simulate();

    view.displayResults(match);

    makeStats(match.details);

    stats_view.displayFormation(home_players, away_players, match.details);

    controller.sendToServer(match);
  },
  showTeams() {
    var home_team_name_element = document.getElementById("home_team_name"),
      away_team_name_element = document.getElementById("away_team_name"),
      home_team_icon = document.getElementById("home_icon"),
      away_team_icon = document.getElementById("away_icon");

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
    match_object.details.HomeSquadStats = home_players_match;
    match_object.details.AwaySquadStats = away_players_match;
    console.log("In send to server");
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

        // Set SelectedFixture
        selected_fixture = fixtures[match.match_number];

        if (selected_fixture.Played) {
          // Set Squad stats
          home_players_match = selected_fixture.HomeSquadStats;
          away_players_match = selected_fixture.AwaySquadStats;
        }

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
  distributeStats(goals, squad_obj, TeamDetails) {
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
    if (!selected_fixture.Played) {
      home_players_match = home_players;
      away_players_match = away_players;
    }
    let formation_table = document.getElementsByName("formation");

    // Sort players according to position

    stats_model.formations.home_321.forEach((pos, i) => {
      let name = document.createElement("span");

      formation_table[pos].setAttribute("class", "text-center");
      formation_table[pos].setAttribute("id", "home-" + i);
      name.innerText = home_players_match[i].Name.split(" ")[
        home_players_match[i].Name.split(" ")["length"] - 1
      ];

      formation_table[
        pos
      ].innerHTML = `<img src="/img/generic_player_kit.png" height="50px">`;
      // formation_table[pos].appendChild(ball);
      formation_table[pos].appendChild(name);
      // formation_table[pos].innerText = away_players[i].ShirtNumber;
      if (home_players_match[i].GoalsScored > 0) {
        var ball = document.createElement("img");
        ball.setAttribute("src", "/img/ball.png");
        ball.setAttribute("class", "ball icon");
        formation_table[pos].appendChild(ball);
        console.log(home_players_match[i].Name);
      }
    });

    stats_model.formations.away_321.forEach((pos, i) => {
      let name = document.createElement("span");

      formation_table[pos].setAttribute("class", "text-center");
      formation_table[pos].setAttribute("id", "home-" + i);
      name.innerText = away_players_match[i].Name.split(" ")[
        away_players_match[i].Name.split(" ")["length"] - 1
      ];

      formation_table[
        pos
      ].innerHTML = `<img src="/img/generic_player_kit.png" height="50px">`;
      // formation_table[pos].appendChild(ball);
      formation_table[pos].appendChild(name);
      // formation_table[pos].innerText = away_players[i].ShirtNumber;
      if (away_players_match[i].GoalsScored > 0) {
        var ball = document.createElement("img");
        ball.setAttribute("src", "/img/ball.png");
        ball.setAttribute("class", "ball icon");
        formation_table[pos].appendChild(ball);
        console.log(away_players_match[i].Name);
      }
    });
    stats_view.displaySquadInfo();
  },
  displaySquadInfo() {
    let home_squad_name = document.getElementById("home_squad_name"),
      away_squad_name = document.getElementById("away_squad_name"),
      home_squad_icon = document.getElementById("home_squad_icon"),
      home_kit_icon = document.getElementById("home_kit_icon"),
      home_manager_name = document.getElementById("home_manager_name"),
      home_squad_list = document.getElementById("home_squad_list");

    home_squad_icon.innerHTML = `<img src="/img/${home_team_code}.png" height="40px">`;
    home_squad_name.innerText = home_team_code;
    home_kit_icon.innerHTML = `<img src="/img/generic_player_kit.png" height="40px">`;
    home_manager_name.innerText = clubs[0].Manager;

    home_players_match.forEach((player, i) => {
      let player_el = document.createElement("li");
      player_el.innerHTML = `<b>${player.Name}</b> ${player.Position} ${
        player.ShirtNumber
      }`;
      if (player.Points > 3) {
        player_el.setAttribute("class", "good_form");
      } else if (player.Points > 1 && player.Points < 3) {
        player_el.setAttribute("class", "average_form");
      } else if (player.Points <= 1) {
        player_el.setAttribute("class", "poor_form");
      }
      home_squad_list.appendChild(player_el);
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

function makeStats(match) {
  home_players_match = stats_model.distributeStats(
    match.HomeTeamScore,
    home,
    match.HomeTeamDetails
  );
  away_players_match = stats_model.distributeStats(
    match.AwayTeamScore,
    away,
    match.AwayTeamDetails
  );
}

// 10-02-19 11pm
/**
 * Next: Add UI and add clubs directly.
 */
handlers.setUpEventListeners();
controller.getFixtureDetails();
