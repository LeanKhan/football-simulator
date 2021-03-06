var season = {};

season.LeagueCode = document.URL.split("?")[1]
  .split("&")[0]
  .split("=")[1];
season.SeasonTitle = document.URL.split("?")[1]
  .split("&")[1]
  .split("=")[1]
  .replace(/\+/g, " ");
season.SeasonCode = document.URL.split("?")[1]
  .split("&")[2]
  .split("=")[1];
season.SeasonLongCode = season.LeagueCode + ":" + season.SeasonCode;

// Array of clubs in selected league

var clubs = [];

var fixtures = [];

var seasons = [];

var model = {
  setupClubs() {
    let competition_name = document.getElementById("competition_name");

    league_code = season.LeagueCode;

    competition_name.innerText = season.SeasonLongCode;
    clubs = controller.getClubs();
  },
  season_details: {
    SeasonLongCode: ""
  },
  makeFixtures() {
    if (season.LeagueCode == "L1") {
      // Week 1
      fixtures.push(new Match(clubs[0], clubs[1]).details);
      fixtures.push(new Match(clubs[2], clubs[3]).details);
      fixtures.push(new Match(clubs[4], clubs[5]).details);
      // Week 2
      fixtures.push(new Match(clubs[5], clubs[1]).details);
      fixtures.push(new Match(clubs[0], clubs[3]).details);
      fixtures.push(new Match(clubs[2], clubs[4]).details);
      // Week 3
      fixtures.push(new Match(clubs[1], clubs[3]).details);
      fixtures.push(new Match(clubs[4], clubs[0]).details);
      fixtures.push(new Match(clubs[5], clubs[2]).details);
      // Week 4
      fixtures.push(new Match(clubs[3], clubs[4]).details);
      fixtures.push(new Match(clubs[1], clubs[2]).details);
      fixtures.push(new Match(clubs[0], clubs[5]).details);
      // Week 5
      fixtures.push(new Match(clubs[2], clubs[0]).details);
      fixtures.push(new Match(clubs[4], clubs[1]).details);
      fixtures.push(new Match(clubs[3], clubs[5]).details);
      // Week 6
      fixtures.push(new Match(clubs[1], clubs[0]).details);
      fixtures.push(new Match(clubs[3], clubs[2]).details);
      fixtures.push(new Match(clubs[5], clubs[4]).details);
      // Week 7
      fixtures.push(new Match(clubs[1], clubs[5]).details);
      fixtures.push(new Match(clubs[3], clubs[0]).details);
      fixtures.push(new Match(clubs[4], clubs[2]).details);
      // Week 8
      fixtures.push(new Match(clubs[3], clubs[1]).details);
      fixtures.push(new Match(clubs[0], clubs[4]).details);
      fixtures.push(new Match(clubs[2], clubs[5]).details);
      // Week 9
      fixtures.push(new Match(clubs[4], clubs[3]).details);
      fixtures.push(new Match(clubs[2], clubs[1]).details);
      fixtures.push(new Match(clubs[5], clubs[0]).details);
      // Week 10
      fixtures.push(new Match(clubs[0], clubs[2]).details);
      fixtures.push(new Match(clubs[1], clubs[4]).details);
      fixtures.push(new Match(clubs[5], clubs[3]).details);
    } else {
      // League 3 and 2 Fixtures
      // Weeks 1 - 3
      fixtures.push(new Match(clubs[1], clubs[2]).details);
      fixtures.push(new Match(clubs[0], clubs[3]).details);
      fixtures.push(new Match(clubs[2], clubs[0]).details);
      fixtures.push(new Match(clubs[3], clubs[1]).details);
      fixtures.push(new Match(clubs[1], clubs[0]).details);
      fixtures.push(new Match(clubs[2], clubs[3]).details);
      // Weeks 4 - 6
      fixtures.push(new Match(clubs[2], clubs[1]).details);
      fixtures.push(new Match(clubs[3], clubs[0]).details);
      fixtures.push(new Match(clubs[0], clubs[2]).details);
      fixtures.push(new Match(clubs[1], clubs[3]).details);
      fixtures.push(new Match(clubs[0], clubs[1]).details);
      fixtures.push(new Match(clubs[3], clubs[2]).details);
    }

    view.displayFixtures(fixtures, false);

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        console.log(xhttp.responseText);
        model.makeStandings();
      }
    };

    xhttp.open("POST", `/data/seasons/${season.SeasonLongCode}/fixtures`, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(fixtures));
  },
  displayFixtures() {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        fixtures = JSON.parse(xhttp.response);
        view.displayFixtures(fixtures, true);
      }
    };
    xhttp.open("GET", `/data/seasons/${season.SeasonLongCode}/fixtures`, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
  },
  makeStandings() {
    let standings = [];
    clubs.forEach((club, i) => {
      let standing = {};
      standing.Team = club.Name;
      standing.Points = 0;
      standing.Played = 0;
      standing.TeamCode = club.ClubCode;
      standing.Wins = 0;
      standing.Losses = 0;
      standing.Draws = 0;
      standing.GF = 0;
      standing.GA = 0;
      standing.GD = 0;

      standings.push(standing);
    });
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        console.log(xhttp.responseText);
      }
    };

    xhttp.open(
      "POST",
      `/data/seasons/${season.SeasonLongCode}/standings`,
      true
    );
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(standings));
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
    HomeClubCode: teamA.ClubCode,
    AwayClubCode: teamB.ClubCode,
    HomeTeamAC: teamA.AttackingClass,
    AwayTeamAC: teamB.AttackingClass,
    HomeTeamDC: teamA.DefensiveClass,
    AwayTeamDC: teamB.DefensiveClass,
    HomeTeamScore: "",
    AwayTeamScore: "",
    Winner: "",
    Loser: "",
    Draw: false,
    Played: false,
    Stadium: teamA.Stadium
  };
}

var view = {
  displayFixtures(fixtures, isOld) {
    if (areAllPlayed(fixtures)) {
      this.displayAlert();
    }
    let fixture_list = document.getElementById("list");
    fixture_list.innerHTML = "";

    fixture_list.setAttribute("class", "list-group");
    fixtures.forEach((fixture, i) => {
      let list_item = document.createElement("li");

      let home_div = document.createElement("div");
      let away_div = document.createElement("div");
      let details_div = document.createElement("div");

      let home_title = document.createElement("span");
      let away_title = document.createElement("span");

      let home_icon = document.createElement("img");
      let away_icon = document.createElement("img");

      let divider = document.createElement("div");
      let link = document.createElement("a");

      // Set MatchCode
      if (!isOld) {
        fixture.MatchCode = season.SeasonLongCode + ":" + "M" + i;
      }

      list_item.setAttribute("id", fixture.MatchCode);
      list_item.setAttribute("class", "mb-1");

      link.setAttribute(
        "class",
        "list-group-item dark-bg d-flex justify-content-between h5 py-1 px-2"
      );
      divider.setAttribute("class", "h4");
      if (fixture.Played) {
        divider.innerHTML = `<span class="text-secondary">${
          fixture.HomeTeamScore
        } : ${fixture.AwayTeamScore}</span>`;
      } else {
        divider.innerHTML = `<span class="text-success">Play</span>`;
      }

      // Set club icons
      home_icon.setAttribute("src", `/img/${fixture.HomeClubCode}.png`);
      home_icon.setAttribute("height", "40px");
      home_title.innerHTML = `<b>${fixture.Home}</b>`;

      away_icon.setAttribute("src", `/img/${fixture.AwayClubCode}.png`);
      away_icon.setAttribute("height", "40px");
      away_title.innerHTML = `<b>${fixture.Away}</b>`;

      // Append icons
      home_div.appendChild(home_icon);
      home_div.appendChild(home_title);

      away_div.appendChild(away_icon);
      away_div.appendChild(away_title);

      // Append all items to link element
      link.appendChild(home_div);
      link.appendChild(divider);
      link.appendChild(away_div);

      // Set the link to the match
      link.setAttribute("href", `/match/play/${fixture.MatchCode}/${i}`);

      // Append link element to list item
      list_item.appendChild(link);

      // Set details in details_div element
      details_div.innerHTML = `<p class="text-center m-0">Live at <span class="text-muted">${
        fixture.Stadium
      }</span></p>`;

      list_item.appendChild(details_div);

      // Append list item to list group
      fixture_list.appendChild(list_item);
    });
  },
  populateSeasonsSelect(seasons) {
    let season_select = document.getElementById("season_select");
    season_select.innerHTML = "";
    seasons.forEach((season, i) => {
      let option_element = document.createElement("option");
      option_element.innerText = season.SeasonTitle;
      option_element.setAttribute("value", season.SeasonLongCode);
      option_element.setAttribute("name", "season_select");
      option_element.addEventListener("click", ev => {
        // console.log(ev.target.value);
        if (model.season_details.SeasonLongCode == "") {
          model.season_details.SeasonLongCode = ev.target.value;
        }
        fixtures = season.Fixtures;
        view.displayFixtures(season.Fixtures, true);
      });
      season_select.appendChild(option_element);
    });
  },
  displayAlert() {
    let alert_div = document.getElementById("alerts");
    alert_div.innerHTML = "";
    let alert_marquee = document.createElement("div");
    alert_marquee.setAttribute("class", "alert h4 text-white shadow");
    alert_marquee.setAttribute(
      "style",
      "background: url('/img/season_banner.png');background-position: center; background-size: cover;"
    );

    alert_marquee.innerHTML = `Hooray! Season is over! See the season stats <a href="/views/page/stats/${
      season.SeasonLongCode
    }">Here</a>`;

    alert_div.appendChild(alert_marquee);
  }
};

var controller = {
  // Get the list of the clubs in the selected league
  getClubs() {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        clubs = JSON.parse(xhttp.response);
      }
    };

    xhttp.open(
      "GET",
      `/clubs/all/clubs?league_code=${season.SeasonLongCode.split(":")[0]}`,
      true
    );
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
  },
  getSeasonsByLeague(league_code) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        seasons = JSON.parse(xhttp.response);

        view.populateSeasonsSelect(seasons);
      }
    };

    xhttp.open("GET", `/data/league/${league_code}/seasons`, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
  }
};

var handlers = {
  setUpEventListeners() {
    let league_select = document.getElementsByName("league_select");
    league_select.forEach((el, key) => {
      el.addEventListener("click", ev => {
        controller.getSeasonsByLeague(ev.target.value);
      });
    });
  }
};

function areAllPlayed(fixtures) {
  return fixtures.every((fixture, i) => {
    return fixture.Played;
  });
}

model.setupClubs();

handlers.setUpEventListeners();
