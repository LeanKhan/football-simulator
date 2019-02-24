// action-figure football simulation :)

var home_match_details = "";
var away_match_details = "";
var match_details_labels = "";

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
  this.match_title = "";
  this.details = {
    League: "",
    Season: "",
    Home: teamA.name,
    Away: teamB.name,
    HomeScore: teamA.goals,
    AwayScore: teamB.goals,
    Winner: "",
    Loser: "",
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
      this.details.Winner = false;
      this.details.Draw = true;
    } else if (this.teamA.goals > this.teamB.goals) {
      this.details.Winner = this.teamA.name;
      this.details.Loser = this.teamB.name;
    } else {
      this.details.Winner = this.teamB.name;
      this.details.Loser = this.teamA.name;
    }

    this.details.Played = true;
    this.details.HomeScore = this.teamA.goals;
    this.details.AwayScore = this.teamB.goals;

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

/* Bellean League III */
const DR = new Team("Dagada Rangers F.C", 5, 5);
const RB = new Team("Rainbow Boys F.C", 6, 5);
const SPR = new Team("Southport Rangers A.C", 5, 4);
const IB = new Team("Ivania Boys Club", 7, 6);

/* National League II */
const BWH = new Team("Brickwall Hadad S.C", 8, 6);
const NSM = new Team("New Simeone Mirrors F.C", 8, 8);
const ZD = new Team("Zander Drangons A.C", 7, 6);
const RP = new Team("Royal Philamentia F.C", 9, 7);

/* Epson League I */
const BFC = new Team("Binatone F.C", 11, 10);
const GU = new Team("Guttersburg United A.F.C", 10, 9);
const LU = new Team("Lasena United F.C", 8, 11);
const LRU = new Team("Lonen Raid 01 United F.C", 9, 10);
const RT = new Team("Rising Thunders A.C", 11, 9);
const K94 = new Team("Khashiru 94 A.C", 9, 8);

var Model = {
  league_3: { DR: DR, RB: RB, SPR: SPR, IB: IB },
  league_2: { BWH: BWH, NSM: NSM, ZD: ZD, RP: RP },
  league_1: { BFC: BFC, GU: GU, LU: LU, LRU: LRU, RT: RT, K94: K94 }
};

var view = {
  // Show teams
  showResults(match) {
    let home_match_details_element = document.getElementById(
      "home_match_details"
    );
    let away_match_details_element = document.getElementById(
      "away_match_details"
    );
    let match_details_labels_element = document.getElementById(
      "match_details_labels"
    );
    let home_score = document.getElementById("home_score");
    let away_score = document.getElementById("away_score");
    let score_divider = document.getElementById("score_divider");

    match.simulate();

    home_score.innerHTML = `<b>${match.teamA.goals}</b>`;
    away_score.innerHTML = `<b>${match.teamB.goals}</b>`;
    score_divider.innerHTML = "<span>-</span>";
    match_details_labels_element.innerHTML = match_details_labels;
    home_match_details_element.innerHTML = home_match_details;
    away_match_details_element.innerHTML = away_match_details;

    controller.sendToServer(match);
  }
};

var controller = {
  sendToServer(match) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("notifications").innerText = xhttp.responseText;
      }
    };

    xhttp.open("POST", "/match/new", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ match: match.details }));
  }
};

var selected_league;
var selected_league_text;
var home_team;
var away_team;

// Select the home form

var handlers = {
  setUpTeamSelectors() {
    let home_team_select = document.getElementsByName("home");
    let away_team_select = document.getElementsByName("away");
    let home_team_name_element = document.getElementById("home_team_name");
    let away_team_name_element = document.getElementById("away_team_name");
    let home_team_icon = document.getElementById("home_icon");
    let away_team_icon = document.getElementById("away_icon");
    // let simulate_button = document.getElementById("simulate_button");

    // Home team selectors
    home_team_select.forEach((el, key) => {
      el.addEventListener("click", ev => {
        let home_team_name = Model[selected_league][ev.target.value].name;
        let home_team_code = ev.target.value;
        home_team = Model[selected_league][ev.target.value];
        home_team_name_element.innerHTML = `${home_team_name}`;
        home_team_icon.innerHTML = `<img src="/img/${home_team_code}.png" height="150px" width="150px">`;
      });
    });
    // Away Team Selectors
    away_team_select.forEach((el, key) => {
      el.addEventListener("click", ev => {
        let away_team_name = Model[selected_league][ev.target.value].name;
        let away_team_code = ev.target.value;
        away_team = Model[selected_league][ev.target.value];
        away_team_name_element.innerHTML = `${away_team_name}`;
        away_team_icon.innerHTML = `<img src="/img/${away_team_code}.png" height="150px" width="150px">`;
      });
    });
  },
  setUpEventListeners() {
    // Select the league and teams
    var home_team_selection_form = document.forms.home_team_select_form;
    var away_team_selection_form = document.forms.away_team_select_form;
    let league_detail = document.getElementById("league_detail");
    let league_select = document.getElementsByName("league_select");
    let simulate_button = document.getElementById("simulate_button");

    // Select league
    league_select.forEach((el, key) => {
      el.addEventListener("click", function(ev) {
        league_detail.innerHTML = `<img src="/img/league${
          ev.target.value
        }_logo.png" height="72px">`;
        selected_league_text = ev.target.innerText;
        switch (key) {
          case 0:
            selected_league = "league_3";
            home_team_selection_form.innerHTML = `<input type=\"radio\" value=\"DR\" name=\"home\">Dagada Rangers F.C
          <br>
          <input type=\"radio\" value=\"RB\" name=\"home\">Rainbow Boys F.C
          <br>
          <input type=\"radio\" value=\"SPR\" name=\"home\">Southport Rangers
          A.C <br>
          <input type=\"radio\" value=\"IB\" name=\"home\">Ivania Boys Club
          <br>`;
            away_team_selection_form.innerHTML = `<input type=\"radio\" value=\"DR\" name=\"away\">Dagada Rangers F.C
          <br>
          <input type=\"radio\" value=\"RB\" name=\"away\">Rainbow Boys F.C
          <br>
          <input type=\"radio\" value=\"SPR\" name=\"away\">Southport Rangers
          A.C <br>
          <input type=\"radio\" value=\"IB\" name=\"away\">Ivania Boys Club
          <br>`;
            break;
          case 1:
            selected_league = "league_2";
            home_team_selection_form.innerHTML = ` <input type=\"radio\" value=\"BWH\" name=\"home\">Brickwall Hadad S.C
            <br>
            <input type=\"radio\" value=\"NSM\" name=\"home\">New Simeone Mirrors
            F.C <br>
            <input type=\"radio\" value=\"ZD\" name=\"home\">Zander Dragons <br>
            <input type=\"radio\" value=\"RP\" name=\"home\">Royal Philamentia
            <br>`;
            away_team_selection_form.innerHTML = ` <input type=\"radio\" value=\"BWH\" name=\"away\">Brickwall Hadad S.C
            <br>
            <input type=\"radio\" value=\"NSM\" name=\"away\">New Simeone Mirrors
            F.C <br>
            <input type=\"radio\" value=\"ZD\" name=\"away\">Zander Dragons <br>
            <input type=\"radio\" value=\"RP\" name=\"away\">Royal Philamentia
            <br>`;
            break;
          case 2:
            selected_league = "league_1";
            home_team_selection_form.innerHTML = `<input type=\"radio\" value=\"BFC\" name=\"home\">Binatone F.C
            <br>
            <input type=\"radio\" value=\"GU\" name=\"home\">Guttersburg United A.F.C
            <br>
            <input type=\"radio\" value=\"LU\" name=\"home\">Lasena United S.C<br>
            <input type=\"radio\" value=\"LRU\" name=\"home\">Lonen Raid 01 United F.C
            <br>
            <input type=\"radio\" value=\"RT\" name=\"home\">Rising Thunders A.C<br>
            <input type=\"radio\" value=\"K94\" name=\"home\">Khashiru 94 A.C`;
            away_team_selection_form.innerHTML = `<input type=\"radio\" value=\"BFC\" name=\"away\">Binatone F.C
            <br>
            <input type=\"radio\" value=\"GU\" name=\"away\">Guttersburg United A.F.C
            <br>
            <input type=\"radio\" value=\"LU\" name=\"away\">Lasena United S.C<br>
            <input type=\"radio\" value=\"LRU\" name=\"away\">Lonen Raid 01 United F.C
            <br>
            <input type=\"radio\" value=\"RT\" name=\"away\">Rising Thunders A.C<br>
            <input type=\"radio\" value=\"K94\" name=\"away\">Khashiru 94 A.C`;
            break;
          default:
            break;
        }
      });
    });
    simulate_button.addEventListener("click", ev => {
      var new_match = new Match(home_team, away_team);
      new_match.details.League = selected_league_text;
      view.showResults(new_match);
    });
  }
};

// 10-02-19 11pm
/**
 * Next: Add UI and add clubs directly.
 */
handlers.setUpEventListeners();
