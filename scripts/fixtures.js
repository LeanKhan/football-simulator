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
        league_code = season.LeagueCode;

        competition_name.innerText = season.SeasonLongCode;
        clubs = controller.getClubs(league_code);
      }
    };

    xhttp.open("GET", "/data/competition-details", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
  },
  makeFixtures() {
    if (season.LeagueCode == "L1") {
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

    view.displayFixtures(fixtures);

    // fixtures.forEach((fixture, i) => {
    //   let list_item = document.createElement("li");

    //   let home_div = document.createElement("div");
    //   let away_div = document.createElement("div");
    //   let details_div = document.createElement("div");

    //   let home_title = document.createElement("span");
    //   let away_title = document.createElement("span");

    //   let home_icon = document.createElement("img");
    //   let away_icon = document.createElement("img");

    //   let divider = document.createElement("div");
    //   let link = document.createElement("a");

    //   // Set MatchCode
    //   fixture.MatchCode =
    //     season.LeagueCode + ":" + season.SeasonCode + ":" + "M" + i;

    //   list_item.setAttribute("id", fixture.MatchCode);
    //   list_item.setAttribute("class", "mb-1");

    //   link.setAttribute(
    //     "class",
    //     "list-group-item border-bottom-rounded d-flex justify-content-between"
    //   );
    //   divider.setAttribute("class", "card");
    //   if (fixture.Played) {
    //     divider.innerHTML = `<span class="text-secondary">View</span>`;
    //   } else {
    //     divider.innerHTML = `<span class="text-success">Play</span>`;
    //   }

    //   // Set club icons
    //   home_icon.setAttribute("src", `/img/${fixture.HomeClubCode}.png`);
    //   home_icon.setAttribute("height", "40px");
    //   home_title.innerHTML = `<b>${fixture.Home}</b>`;

    //   away_icon.setAttribute("src", `/img/${fixture.AwayClubCode}.png`);
    //   away_icon.setAttribute("height", "40px");
    //   away_title.innerHTML = `<b>${fixture.Away}</b>`;

    //   // Append icons
    //   home_div.appendChild(home_icon);
    //   home_div.appendChild(home_title);

    //   away_div.appendChild(away_icon);
    //   away_div.appendChild(away_title);

    //   // Append all items to link element
    //   link.appendChild(home_div);
    //   link.appendChild(divider);
    //   link.appendChild(away_div);

    //   // Set the link to the match
    //   link.setAttribute("href", `/match/play/${fixture.MatchCode}/${i}`);

    //   // Append link element to list item
    //   list_item.appendChild(link);

    //   // Set details in details_div element
    //   details_div.innerHTML = `<p class="text-center m-0">Live at <span class="text-muted">${
    //     fixture.Stadium
    //   }</span></p>`;

    //   list_item.appendChild(details_div);

    //   // Append list item to list group
    //   fixture_list.appendChild(list_item);
    // });

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        console.log(xhttp.responseText);
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
        view.displayFixtures(fixtures);
      }
    };
    xhttp.open("GET", `/data/seasons/${season.SeasonLongCode}/fixtures`, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
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
  displayFixtures(fixtures) {
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
      fixture.MatchCode =
        season.LeagueCode + ":" + season.SeasonCode + ":" + "M" + i;

      list_item.setAttribute("id", fixture.MatchCode);
      list_item.setAttribute("class", "mb-1");

      link.setAttribute(
        "class",
        "list-group-item border-bottom-rounded d-flex justify-content-between h5 py-1 px-2"
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
  }
};

var controller = {
  // Get the list of the clubs in the selected league
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
