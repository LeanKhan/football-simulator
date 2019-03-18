// action-figure football simulation :)

var home_match_details = "";
var away_match_details = "";

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
      home_af = document.getElementById("home_af"),
      away_af = document.getElementById("away_af"),
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
    home_ccr.innerText = match.HomeTeamDetails.ChancesCreatedRate.toFixed(3);

    away_ccr.setAttribute("class", "progress-bar away-progress-bar");
    away_ccr.setAttribute("style", `width: ${away_ccr_value}%`);
    away_ccr.innerText = match.AwayTeamDetails.ChancesCreatedRate.toFixed(3);

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
  },
  showResults(match) {
    match.simulate();

    selected_fixture = match.details;

    view.displayResults(match.details);

    makeStats(match.details);

    stats_view.displayFormations();

    stats_view.displaySquadInfo();

    view.displayTimeline(stats_model.events);

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

    // stats_view.displaySquadInfo();

    // League Logo
    league_detail.innerHTML = `<img src="/img/${
      SeasonLongCode.split(":")[0]
    }.png" height="72px">`;
    if (selected_fixture.Played) {
      view.displayResults(selected_fixture);
    }
    stats_model.getMatch();
  },
  displayTimeline(events){

    let timeline_container = document.getElementById("timeline");
    timeline_container.innerHTML = "";

     if(events.length == 0){
      timeline_container.innerHTML = "<div class='mx-auto h4' >No events yet!</div>"
    }else{

      let dividing_line = document.createElement("div");

      dividing_line.setAttribute("class","dividing-line");

    events.forEach((event,i)=>{

      let event_el = document.createElement("div");
      event_el.setAttribute("class","event mb-2");

      let side_el = document.createElement("div");
      side_el.setAttribute("class",`${event.side}-event d-flex`);
      
      let time_el = document.createElement("span");
      time_el.style = "font-weight: bold; font-size: larger; margin-left: 0.25rem";

      let player_name = document.createElement("span");
      player_name.style = "align-self: center;";

      time_el.innerText = `${event.minute}'`;
      player_name.innerText = event.subject;

      side_el.appendChild(time_el);
      side_el.appendChild(player_name);

      let event_marker = document.createElement("div");
      
      let event_obj = identifyEventType(event.code);

      event_marker.setAttribute("class",event_obj.class_value); 
      
      event_marker.innerHTML = `<img src="${event_obj.icon}">`;

      event_el.appendChild(side_el);

      event_el.appendChild(event_marker);

      timeline_container.appendChild(event_el);

      timeline_container.appendChild(dividing_line);

    });
    }
  }
};
// Object containing season.season_text and season.season_code

var controller = {
  sendToServer(match_object) {
    match_object.details.HomeSquadStats = home_players;
    match_object.details.AwaySquadStats = away_players;
    match_object.details.Events = stats_model.events;
    console.log("Sent events =>",match_object.details.Events);
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
        // debugger;
        fixtures = JSON.parse(xhttp.response);

        // Set SelectedFixture
        selected_fixture = fixtures[match.match_number];

        if (selected_fixture.Played) {
          // Set Squad stats
          home_players = selected_fixture.HomeSquadStats;
          away_players = selected_fixture.AwaySquadStats;
          stats_model.events = selected_fixture.Events;
          setPoints(home_players,"home",away_players,"away");
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

    var home_score = document.getElementById("home_score");
    var away_score = document.getElementById("away_score");
    var score_divider = document.getElementById("score_divider");
    // Select the league and teams

    // Formation selection

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
          initialPoints(home_players);
          initialPoints(away_players);
          stats_model.points = [];
          stats_model.events = [];
          view.showResults(new_match);
        }
      } else {
        stats_model.events = [];
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
  },
  formationSelectListeners() {
    var home_formation_select_elements = document.getElementsByName(
      "home_formation"
    );
    var away_formation_select_elements = document.getElementsByName(
      "away_formation"
    );

    home_formation_select_elements.forEach((el, key) => {
      el.addEventListener("click", ev => {
        stats_model.formations.home_previous =
          stats_model.formations.home_current;
        stats_model.formations.home_current = ev.target.value;
        stats_view.displaySquadFormation(
          stats_model.formations.home_current,
          stats_model.formations.home_previous,
          home_players,
          "home"
        );
        stats_view.displayMOTM();
      });
    });

    away_formation_select_elements.forEach((el, key) => {
      el.addEventListener("click", ev => {
        stats_model.formations.away_previous =
          stats_model.formations.away_current;
        stats_model.formations.away_current = ev.target.value;
        stats_view.displaySquadFormation(
          stats_model.formations.away_current,
          stats_model.formations.away_previous,
          away_players,
          "away"
        );
        stats_view.displayMOTM();
      });
    });
  }
};

// Stats Side
let fixture;
let clubs;
let home_players;
let away_players;
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

        if (!fixture.Played) {
          if(home_team_code == clubs[0].ClubCode){
            home_players = clubs[0].Players;
            away_players = clubs[1].Players;
          }else if(away_team_code == clubs[0].ClubCode) {
            away_players = clubs[0].Players;
            home_players = clubs[1].Players;
          }
          initialPoints(home_players);
          initialPoints(away_players);
        }

        setPlayers(home, home_players);
        setPlayers(away, away_players);

        sortPlayers();
        stats_view.displayFormations();
        stats_view.displaySquadInfo();
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
    home_current: "home_321",
    away_current: "away_321",
    home_previous: "home_321",
    away_previous: "away_321",
    home_321: [3, 15, 17, 19, 23, 25, 31],
    away_321: [66, 50, 52, 54, 44, 46, 38],
    home_321_back: [3, 8, 10, 12, 16, 18, 24],
    away_321_back: [66, 57, 59, 61, 51, 53, 45],
    home_321_wide: [3, 8, 10, 12, 15, 19, 17],
    away_321_wide: [66, 57, 59, 61, 43, 47, 38],
    away_2121_wide: [66, 58, 52, 60, 43, 47, 38]
  },
  points: [],
  events: [],
  distributeStats(goals, squad_obj, TeamDetails) {
    // console.log(fixture.HomeTeamDetails);

    // Distribute Goals Scored
    for (let index = 1; index <= goals; index++) {
      let chance = Math.ceil(Math.random() * 12);
      if (chance >= 7) {
        who = Math.ceil(Math.random() * squad_obj.att.length) - 1;
        squad_obj.att[who]["GoalsScored"]++;
        squad_obj.att[who]["Points"]++;
        this.events.push({
          subject: squad_obj.att[who]["LastName"],
          event: "Goal",
          code: 1,
          side: identifySide(squad_obj.att[who]["ClubCode"])
        });
      } else if (chance >= 4 && chance <= 8) {
        who = Math.ceil(Math.random() * squad_obj.mid.length) - 1;
        squad_obj.mid[who]["GoalsScored"]++;
        squad_obj.mid[who]["Points"]++;
        this.events.push({
          subject: squad_obj.mid[who]["LastName"],
          event: "Goal",
          code: 1,
          side: identifySide(squad_obj.mid[who]["ClubCode"])
        });
      } else if (chance == 2 || chance == 3) {
        who = Math.ceil(Math.random() * squad_obj.def.length) - 1;
        squad_obj.def[who]["GoalsScored"]++;
        squad_obj.def[who]["Points"]++;
        this.events.push({
          subject: squad_obj.def[who]["LastName"],
          event: "Goal",
          code: 1,
          side: identifySide(squad_obj.def[who]["ClubCode"])
        });
      } else if (chance < 2) {
        squad_obj.gk[0]["GoalsScored"]++;
        squad_obj.gk[0]["Points"]++;
        this.events.push({
          subject: squad_obj.gk[0]["LastName"],
          event: "Goal",
          code: 1,
          side: identifySide(squad_obj.gk[0]["ClubCode"])
        });
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
    // Distribute Saves and Shots
    for (let index = 1; index <= Math.ceil(Math.random() * 3); index++) {
      who = Math.ceil(Math.random() * squad_obj.att.length) - 1;
      this.events.push({
        subject: squad_obj.gk[0]["LastName"],
        event: "Save",
        code: 3,
        side: identifySide(squad_obj.gk[0]["ClubCode"])
      });
      this.events.push({
        subject: squad_obj.att[who]["LastName"],
        event: "Shot",
        code: 4,
        side: identifySide(squad_obj.att[who]["ClubCode"])
      });
    }
    // Distribute Yellow Cards
    for (let index = 1; index <= Math.ceil(Math.random() * 7); index++) {
      let chance = Math.ceil(Math.random() * 12);
      if (chance >= 9) {
        who = Math.ceil(Math.random() * squad_obj.def.length) - 1;
        this.events.push({
          subject: squad_obj.def[0]["LastName"],
          event: "Yellow Card",
          code: 2,
          side: identifySide(squad_obj.def[who]["ClubCode"])
        });
        squad_obj.def[who]["Points"] -= 0.2;
      } else if (chance == 7 || chance == 8) {
        who = Math.ceil(Math.random() * squad_obj.mid.length) - 1;
        this.events.push({
          subject: squad_obj.mid[0]["LastName"],
          event: "Yellow Card",
          code: 2,
          side: identifySide(squad_obj.mid[who]["ClubCode"])
        });
        squad_obj.mid[who]["Points"] -= 0.2;
      } else if (chance == 6) {
        who = Math.ceil(Math.random() * squad_obj.att.length) - 1;
        this.events.push({
          subject: squad_obj.att[0]["LastName"],
          event: "Yellow Card",
          code: 2,
          side: identifySide(squad_obj.att[who]["ClubCode"])
        });
        squad_obj.att[who]["Points"] -= 0.2;
      } else if (chance == 5) {
        this.events.push({
          subject: squad_obj.gk[0]["LastName"],
          event: "Yellow Card",
          code: 2,
          side: identifySide(squad_obj.gk[0]["ClubCode"])
        });
        squad_obj.gk[0]["Points"] -= 0.2;
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

    stats_view.timeEvents();

    return squad_obj.gk.concat(squad_obj.def, squad_obj.mid, squad_obj.att);
    // home_players = home.gk.concat(home.def,home.mid,home.att);
  }
};

var stats_view = {
  displayFormations() {
    stats_view.displaySquadFormation(
      stats_model.formations.home_current,
      stats_model.formations.home_previous,
      home_players,
      "home"
    );
    stats_view.displaySquadFormation(
      stats_model.formations.away_current,
      stats_model.formations.away_previous,
      away_players,
      "away"
    );
    stats_view.displayMOTM();
  
   view.displayTimeline(stats_model.events);
  },
  displaySquadFormation(current, previous, players, side) {
    let formation_table = document.getElementsByName("formation");
    // Sort players according to position

    stats_model.formations[previous].forEach((pos, i) => {
      formation_table[pos].innerHTML = "";
      formation_table[pos].setAttribute("class", "");
      formation_table[pos].setAttribute("id", "");
    });

    stats_model.formations[current].forEach((pos, i) => {
      let name = document.createElement("span");
      let shirt_number = document.createElement("span");

      formation_table[pos].setAttribute("class", "text-center");
      formation_table[pos].setAttribute("id", side + "-" + i);

      name.innerText = players[i].LastName;
      shirt_number.innerText = players[i].ShirtNumber;

      formation_table[
        pos
      ].innerHTML = `<img src="/img/kits/${players[i].ClubCode}-kit.png" height="52px">`;

      shirt_number.setAttribute("class", "shirt_number");
      // formation_table[pos].appendChild(ball);
      formation_table[pos].appendChild(name);
      formation_table[pos].appendChild(shirt_number);
      // formation_table[pos].innerText = away_players[i].ShirtNumber;
      if (players[i].GoalsScored > 0) {
        var ball = document.createElement("img");
        ball.setAttribute("src", "/img/ball.png");
        ball.setAttribute("class", "ball icon");
        formation_table[pos].appendChild(ball);
        console.log(players[i].LastName);
      }
    });
  },
  displaySquadInfo() {
    let home_squad_name = document.getElementById("home_squad_name"),
      home_squad_icon = document.getElementById("home_squad_icon"),
      home_kit_icon = document.getElementById("home_kit_icon"),
      home_manager_name = document.getElementById("home_manager_name"),
      home_squad_list = document.getElementById("home_squad_list"),
      away_squad_name = document.getElementById("away_squad_name"),
      away_squad_icon = document.getElementById("away_squad_icon"),
      away_kit_icon = document.getElementById("away_kit_icon"),
      away_manager_name = document.getElementById("away_manager_name"),
      away_squad_list = document.getElementById("away_squad_list");

    // Home squad stuff
    home_squad_icon.innerHTML = `<img src="/img/${home_team_code}.png" height="40px">`;
    home_squad_name.innerText = home_team_code;
    home_kit_icon.innerHTML = `<img src="/img/kits/${home_team_code}-kit.png" height="40px">`;
    home_manager_name.innerText = clubs[0].Manager;
    home_squad_list.innerHTML = "";

    // Away squad stuff
    away_squad_icon.innerHTML = `<img src="/img/${away_team_code}.png" height="40px">`;
    away_squad_name.innerText = away_team_code;
    away_kit_icon.innerHTML = `<img src="/img/kits/${away_team_code}-kit.png" height="40px">`;
    away_manager_name.innerText = clubs[1].Manager;
    away_squad_list.innerHTML = "";

    home_players.forEach((player, i) => {
      let player_el = document.createElement("li");
      player_el.innerHTML = `<b>${player.LastName}</b> ${player.Position} ${
        player.ShirtNumber
      }`;
      if (player.Points >= 3) {
        player_el.setAttribute("class", "good_form");
      } else if (player.Points > 1 && player.Points < 3) {
        player_el.setAttribute("class", "average_form");
      } else if (player.Points <= 1) {
        player_el.setAttribute("class", "poor_form");
      }
      home_squad_list.appendChild(player_el);
    });

    // Show Away squad performance
    away_players.forEach((player, i) => {
      let player_el = document.createElement("li");
      player_el.innerHTML = `<b>${player.LastName}</b> ${player.Position} ${
        player.ShirtNumber
      }`;
      if (player.Points > 3) {
        player_el.setAttribute("class", "good_form");
      } else if (player.Points > 1 && player.Points < 3) {
        player_el.setAttribute("class", "average_form");
      } else if (player.Points <= 1) {
        player_el.setAttribute("class", "poor_form");
      }
      away_squad_list.appendChild(player_el);
    });
  },
  displayMOTM() {
    if(selected_fixture.Played){
      let motm_element = document.getElementById(stats_model.points[0].id);

      let motm_icon = document.createElement("img");
      motm_icon.setAttribute("src", "/img/motm.png");
      motm_icon.setAttribute("class", "ball motm_icon");
  
      motm_element.appendChild(motm_icon);
    }
  },
  timeEvents() {
    let times = [
      5,
      10,
      15,
      20,
      25,
      30,
      35,
      40,
      45,
      50,
      55,
      60,
      65,
      70,
      75,
      80,
      85,
      90
    ];
    
    stats_model.events.forEach((event, i) => {
      let w = Math.ceil(Math.random() * 18 - 1);
      let when = times[w] - Math.ceil(Math.random() * 5);

      event.minute = when;

      // console.log(`${event.subject} made a ${event.event} at ${event.minute} minute!`);
    }); 
    stats_model.events.sort((a,b)=>{
      return a.minute - b.minute;
    });
  }
};

function setPlayers(obj, array) {
  array.forEach((pl, i) => {
    if (pl.PositionNumber == 1) {
      obj.gk.push(pl);
    } else if (pl.PositionNumber == 2) {
      obj.def.push(pl);
    } else if (pl.PositionNumber == 3) {
      obj.mid.push(pl);
    } else if (pl.PositionNumber == 4) {
      obj.att.push(pl);
    }
  });
}

function initialPoints(players) {
  players.forEach((player, i) => {
    player.Points = 0;
    player.Assists = 0;
    player.GoalsScored = 0;
    player.CleanSheets = 0;
  });
  stats_model.points = [];
}

function identifySide(club_code){
  if(club_code == home_team_code){
    return "home";
  }else if(club_code == away_team_code){
    return "away";
  }
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
  home_players = stats_model.distributeStats(
    match.HomeTeamScore,
    home,
    match.HomeTeamDetails
  );
  away_players = stats_model.distributeStats(
    match.AwayTeamScore,
    away,
    match.AwayTeamDetails
  );
  setPoints(home_players, "home",away_players,"away");
};

function setPoints(home_squad, home_side, away_squad, away_side){

  // Push all home players
  home_squad.forEach((player,index)=>{
    stats_model.points.push({
      points: player.Points,
      id: home_side + "-" + index,
      name: player.FirstName + " " + player.LastName
    });
  });

  // Push all away players
  away_squad.forEach((player,index)=>{
    stats_model.points.push({
      points: player.Points,
      id: away_side + "-" + index,
      name: player.FirstName + " " + player.LastName
    });
  });

  // After pushing all players' points to the points array, sort!
  stats_model.points.sort((a, b) => {
    return b.points - a.points;
  });
};

function identifyEventType(event_code){
  let event_obj = { };
  switch (event_code) {
    case 1:
      event_obj.class_value = "event-marker goal-event";
      event_obj.icon = "/img/shot3.png";
      break;
    case 2:
      event_obj.class_value = "event-marker yellow-card-event";
      event_obj.icon = "/img/yellow-card.png";
      break;
    case 3:
      event_obj.class_value = "event-marker";
      event_obj.icon = "/img/save.png";
      break;
    case 4:
      event_obj.class_value = "event-marker";
      event_obj.icon = "/img/shot.png";
      break;
  }
  return event_obj;
};

// 10-02-19 11pm
/**
 * Next: Add UI and add clubs directly.
 */
handlers.setUpEventListeners();
handlers.formationSelectListeners();
controller.getFixtureDetails();
