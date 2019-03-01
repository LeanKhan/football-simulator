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
  showResults(match) {
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

    match.simulate();

    home_score.innerHTML = `<b>${match.teamA.goals}</b>`;
    away_score.innerHTML = `<b>${match.teamB.goals}</b>`;
    score_divider.innerHTML = "<span>-</span>";
    match_details_labels_element.innerHTML = match_details_labels;
    home_match_details_element.innerHTML = home_match_details;
    away_match_details_element.innerHTML = away_match_details;

    controller.sendToServer(match);
  },
  showTeams() {
    var home_team_name_element = document.getElementById("home_team_name");
    var away_team_name_element = document.getElementById("away_team_name");
    var home_team_icon = document.getElementById("home_icon");
    var away_team_icon = document.getElementById("away_icon");
    var league_detail = document.getElementById("league_detail");

    let simulate_button = document.getElementById("simulate_button");

    home_team_name_element.innerText = selected_fixture.Home;
    away_team_name_element.innerText = selected_fixture.Away;

    home_team_icon.innerHTML = `<img src="/img/${home_team_code}.png" height="150px" width="150px">`;
    away_team_icon.innerHTML = `<img src="/img/${away_team_code}.png" height="150px" width="150px">`;

    // League Logo
    league_detail.innerHTML = `<img src="/img/${
      SeasonLongCode.split(":")[0]
    }.png" height="72px">`;
  }
};
// Object containing season.season_text and season.season_code

var controller = {
  // getTeams(){
  //   let xhttp = new XMLHttpRequest();

  //   xhttp.onreadystatechange = ()=>{
  //     if(xhttp.readyState == 4 && xhttp.status == 400){

  //     }
  //   }

  //   xhttp.open("GET", "/match/new", true);
  //   xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  //   xhttp.send(JSON.stringify({ match: match.details }));

  // },
  sendToServer(match_object) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("notifications").innerText = xhttp.responseText;
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
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        match = JSON.parse(xhttp.response);
        SeasonLongCode =
          match.match_code.split(":")[0] + ":" + match.match_code.split(":")[1];
        // console.log(JSON.parse(xhttp.response));
        controller.getFixtures();
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
    var home_team_selection_form = document.forms.home_team_select_form;
    var away_team_selection_form = document.forms.away_team_select_form;
    var league_detail = document.getElementById("league_detail");
    let league_select = document.getElementsByName("league_select");
    let simulate_button = document.getElementById("simulate_button");
    let clear_button = document.getElementById("clear_button");

    simulate_button.addEventListener("click", ev => {
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

// 10-02-19 11pm
/**
 * Next: Add UI and add clubs directly.
 */
handlers.setUpEventListeners();
controller.getFixtureDetails();
