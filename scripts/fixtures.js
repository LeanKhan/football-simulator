var season = {};

// Array of clubs in selected league

var clubs = [];

var fixtures = [];

var model = {
  getCompetionDetails() {
    let xhttp = new XMLHttpRequest();
    let competition_name = document.getElementById("competition_name");
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        season = JSON.parse(xhttp.response);
        console.log(xhttp.response);
        league_code = season.league_code;

        competition_name.innerText = season.league_code + season.season_code;
        clubs = controller.getClubs(league_code);
      }
    };

    xhttp.open("POST", "/data/competition-details", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
  },
  goToPlay(match_code) {
    // let xhttp = new XMLHttpRequest();
    // // document.open(`/match/play/${match_code}`);

    // xhttp.open("GET", `/match/play/${match_code}`);
    // xhttp.setRequestHeader(
    //   "Content-Type",
    //   "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    // );
    // xhttp.setRequestHeader(
    //   "Accept",
    //   "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    // );
    // xhttp.send();
    document.open("/match/play/LSO34");
  },
  makeFixtures() {
    let season_long_code = season;
    let fixture_list = document.getElementById("list");
    fixtures.push(new Match(clubs[1], clubs[2]).details);
    fixtures.push(new Match(clubs[0], clubs[3]).details);
    fixtures.push(new Match(clubs[2], clubs[0]).details);
    fixtures.push(new Match(clubs[3], clubs[1]).details);
    fixtures.push(new Match(clubs[1], clubs[0]).details);
    fixtures.push(new Match(clubs[2], clubs[3]).details);

    fixtures.forEach((fixture, i) => {
      let list_item = document.createElement("li");
      let link = document.createElement("a");

      fixture.MatchCode = fixture.LeagueCode + fixture.SeasonCode + "M" + i;
      list_item.setAttribute("id", fixture.MatchCode);
      link.setAttribute("href", `/match/play/${fixture.MatchCode}`);
      link.innerHTML = `${fixture.Home} vs ${fixture.Away}`;
      list_item.appendChild(link);
      fixture_list.appendChild(list_item);
    });

    console.log(fixtures);
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        console.log(xhttp.responseText);
      }
    };

    xhttp.open("POST", `/data/seasons/${season.season_code}/fixtures`, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(fixtures));
  }
};
function Match(teamA, teamB) {
  this.teamA = {
    name: teamA.Name,
    attacking_class: teamA.AttackingClass,
    defensive_class: teamA.DefensiveClass
  };
  this.teamB = {
    name: teamB.Name,
    attacking_class: teamB.AttackingClass,
    defensive_class: teamB.DefensiveClass
  };
  this.match_title = "";
  this.details = {
    SeasonString: season.season_title,
    SeasonCode: season.season_code,
    LeagueString: "",
    LeagueCode: season.league_code,
    Home: teamA.Name,
    Away: teamB.Name,
    HomeTeamScore: "",
    AwayTeamScore: "",
    Winner: "",
    Loser: "",
    Draw: false,
    Played: false,
    Stadium: teamA.Stadium
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

    this.details.MatchCode = "";
    this.details.HomeTeam = this.teamA.name;
    this.details.AwayTeam = this.teamB.name;
    this.details.SeasonString = season.season_title;
    this.details.SeasonCode = season.season_code;
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
  displayFixtures() {
    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", "/match/play");
  }
};

var controller = {
  getClubs(league) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        clubs = JSON.parse(xhttp.response);
      }
    };

    xhttp.open("GET", `/data/clubs/${league}`, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
  }
};

model.getCompetionDetails();
