let selected_season;
let season_long_code = document.URL.split("/")[6];
let standings;
let players;
let goal_keepers;
let new_player_skill_points = [];
let league_result = {
  Winner: "",
  Relegated: ""
};
let player_rankings = {
  TopScorer: "",
  TopAssists: "",
  TopPoints: "",
  TopGoalKeeper: ""
};
let clubs = [];

var model = {
  getSeason() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        selected_season = JSON.parse(xhttp.response);
        players = selected_season.Players;
        this.sortStandings(selected_season.Standings);
        this.setLeagueResults();
        view.displaySeasonDetails();
        this.doClubThings();
      }
    };
    xhttp.open("GET", "/data/get/seasons/" + season_long_code, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
  },
  sortStandings(standings_array) {
    standings = standings_array.sort((a, b) => {
      if (b.Points == a.Points) {
        if (b.GD == b.GD) {
          return b.GF - a.GF;
        } else {
          b.GD - a.GD;
        }
      } else {
        return b.Points - a.Points;
      }
    });
  },
  setLeagueResults() {
    league_result.Winner = standings[0];
    league_result.Relegated = standings[standings["length"] - 1];
    player_rankings.TopScorer = sortPlayersByAspect(players, "GoalsScored")[0];
    player_rankings.TopAssists = sortPlayersByAspect(players, "Assists")[0];
    player_rankings.TopPoints = sortPlayersByAspect(players, "Points")[0];
    goal_keepers = getTopGK();
    player_rankings.TopGoalKeeper = goal_keepers[0];
    // this.arrangePlayersByClub();
  },
  arrangePlayersByClub() {
    standings.forEach((club, i) => {
      let squad = players.filter((player, i) => {
        if (player.ClubCode == club.TeamCode) {
          return player;
        }
      });
      clubs.push({ ClubCode: club.TeamCode, Squad: squad });
    });
  },
  seasonStats: {
    Matches: "",
    Goals: ""
  },
  doClubThings() {
    collateNewSkillPoints();
    clubsTotalPoints(clubs);
    displayClubAccordion(clubs);
  },
  endSeason() {
    clubs.forEach((club, i) => {
      model.sendClubStatsToServer(club.ClubCode, club);
    });
  },
  sendClubStatsToServer(club_code, club) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        console.log(xhttp.response);
      }
    };

    xhttp.open("POST", `/clubs/update/club?club_code=${club_code}`, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ club: club }));
    // console.log("SendClubStats - Clicked!");
  },
  promoteClub(promoted_club, league_code) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        console.log(xhttp.response);
      }
    };

    xhttp.open(
      "GET",
      `/clubs/update/club/promote?promoted_club=${promoted_club}&league_code=${league_code}`
    );
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
  },
  relegateClub(relegated_club, league_code) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        console.log(xhttp.response);
      }
    };

    xhttp.open(
      "GET",
      `/clubs/update/club/relegate?relegated_club=${relegated_club}&league_code=${league_code}`
    );
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
  }
};

var view = {
  displaySeasonDetails() {
    let season_title_el = document.getElementById("seasonTitle");
    let league_title_el = document.getElementById("leagueTitle");
    let league_logo_el = document.getElementById("leagueLogo");
    let season_matches_el = document.getElementById("seasonMatches");
    let season_goals_el = document.getElementById("seasonGoals");
    let season_winner_el = document.getElementById("seasonWinner");

    season_title_el.innerText = selected_season.SeasonTitle;
    league_title_el.innerText = selected_season.LeagueCode;

    league_logo_el.setAttribute(
      "src",
      `/img/${selected_season.LeagueCode}.png`
    );

    season_matches_el.innerText = selected_season.Fixtures.length + " Matches";

    season_goals_el.innerText = totalGoalsInSeason(standings) + " Goals";

    season_winner_el.innerText = "1 Winner";
    this.displayWinningTeamStats();
    this.displayTopPlayers();
  },
  displayWinningTeamStats() {
    let winner_logo_el = document.getElementById("winner-logo");
    let winning_stats_el = document.getElementById("winning-stats");

    winner_logo_el.setAttribute(
      "src",
      `/img/${league_result.Winner.TeamCode}.png`
    );

    let points_list = `
    <li class="list-inline-item"><span>W</span> ${
      league_result.Winner.Wins
    }</li>
    <li class="list-inline-item"><span>L</span> ${
      league_result.Winner.Losses
    }</li>
    <li class="list-inline-item"><span>D</span> ${
      league_result.Winner.Draws
    }</li>
    <li class="list-inline-item"><span>GF</span> ${league_result.Winner.GF}</li>
    <li class="list-inline-item"><span>GD</span> ${league_result.Winner.GD}</li>
    <li class="list-inline-item"><span>Pts</span> ${
      league_result.Winner.Points
    }</li>
    `;

    winning_stats_el.innerHTML = points_list;
  },
  displayTopPlayers() {
    let top_scorer_el = document.getElementById("top-scorer");
    let top_player_el = document.getElementById("top-player");
    let top_assists_el = document.getElementById("top-assists");
    let top_gk_el = document.getElementById("top-gk");

    // Display the Player of the Season
    top_player_el.innerHTML = `
    <h5>${player_rankings.TopPoints.FirstName} ${
      player_rankings.TopPoints.LastName
    }</h5>
    <p>Player of the Season</p>

    <h3>${Math.round(player_rankings.TopPoints.Points)} Points</h3>

    <div>
    <img src="/img/kits/${player_rankings.TopPoints.ClubCode}-kit.png" />
    <span class="shirt-number">${player_rankings.TopPoints.ShirtNumber}</span>
    </div>

    `;

    // Display the Top Goal Scorer
    top_scorer_el.innerHTML = `
    <h5>${player_rankings.TopScorer.FirstName} ${
      player_rankings.TopScorer.LastName
    }</h5>
    <p>Top Goal Scorer</p>

    <h3>${Math.round(player_rankings.TopScorer.GoalsScored)} Goals</h3>

    <div>
    <img src="/img/kits/${player_rankings.TopScorer.ClubCode}-kit.png" />
    <span class="shirt-number">${player_rankings.TopScorer.ShirtNumber}</span>
    </div>
  
    `;

    // Display player with Most Assits
    top_assists_el.innerHTML = `
    <h5>${player_rankings.TopAssists.FirstName} ${
      player_rankings.TopAssists.LastName
    }</h5>
    <p>Most Assists</p>

    <h3>${Math.round(player_rankings.TopAssists.Assists)} Assists</h3>

    <div>
      <img src="/img/kits/${player_rankings.TopAssists.ClubCode}-kit.png" />
      <span class="shirt-number">${
        player_rankings.TopAssists.ShirtNumber
      }</span>
    </div>
    
    `;

    // Display the Top Goalkeeper
    top_gk_el.innerHTML = `
    <h5>${player_rankings.TopGoalKeeper.FirstName} ${
      player_rankings.TopGoalKeeper.LastName
    }</h5>
    <p>GK of the Season</p>

    <h3>${Math.round(player_rankings.TopGoalKeeper.Points)} Points</h3>

    <div>
    <img src="/img/kits/${player_rankings.TopGoalKeeper.ClubCode}-kit.png" />
    <span class="shirt-number">${
      player_rankings.TopGoalKeeper.ShirtNumber
    }</span>
    </div>
    
    `;
  }
};

var handlers = {
  setUpEventListeners() {
    let endSeasonButton = document.getElementById("end-season");

    endSeasonButton.onclick = () => {
      let ans = confirm(
        "Are you sure you want to end season? \n This is IRREVERSIBLE! "
      );

      if (ans) {
        model.endSeason();
      } else {
        console.log("Poops!");
      }
    };
  }
};

function sortPlayersByAspect(players, aspect) {
  return players.sort((a, b) => {
    return b[aspect] - a[aspect];
  });
}

function collateNewSkillPoints() {
  players.forEach((player, i) => {
    let new_player_stats = calculateNewSkillPoints(
      player,
      player.Position,
      player.Points
    );
    new_player_skill_points.push(new_player_stats);
    player.AttackingClass = new_player_stats.AttackingClass;
    player.DefensiveClass = new_player_stats.DefensiveClass;
    player.GoalkeepingClass = new_player_stats.GoalkeepingClass;
    player.AvgPoints = new_player_stats.average_points;
  });
  model.arrangePlayersByClub();
}

function getTopGK() {
  let gk_array = players.map((player, i) => {
    if (player.Position == "GK") {
      player.Points -= player.GoalsScored * 2.5;
      return player;
    }
  });

  return sortPlayersByAspect(gk_array, "Points");
}

function calculateNewSkillPoints(player, position, points) {
  let new_stats = {};
  let avg_points;
  new_stats.Player_ID = player.Player_ID;
  new_stats.Position = player.Position;

  // [1] Calculate new skill points for each position...

  if (position == "ATT") {
    // [1] ...for Attackers

    avg_points = points / 6;

    new_stats.average_points = avg_points;

    // Check if the player's avg_points are 2 or below
    if (avg_points <= 2) {
      new_stats.DefensiveClassIncrement = -1;
      new_stats.AttackingClassIncrement = -1;
    } else {
      new_stats.AttackingClassIncrement = (avg_points / 100) * 70;
      new_stats.DefensiveClassIncrement = (avg_points / 100) * 30;
    }

    new_stats.AttackingClass =
      new_stats.AttackingClassIncrement + parseFloat(player.AttackingClass);

    new_stats.DefensiveClass =
      new_stats.DefensiveClassIncrement + parseFloat(player.DefensiveClass);

    new_stats.GoalkeepingClass = parseFloat(player.GoalkeepingClass);
  } else if (position == "MID") {
    // [1] ...for Midfielders

    avg_points = points / 6;

    new_stats.average_points = avg_points;

    // Check if this player's avg_points are 2 or below
    if (avg_points <= 2) {
      new_stats.DefensiveClassIncrement = -1;
      new_stats.AttackingClassIncrement = -1;
    } else {
      new_stats.AttackingClassIncrement = (avg_points / 100) * 50;
      new_stats.DefensiveClassIncrement = (avg_points / 100) * 50;
    }

    new_stats.AttackingClass =
      new_stats.AttackingClassIncrement + parseFloat(player.AttackingClass);

    new_stats.DefensiveClass =
      new_stats.DefensiveClassIncrement + parseFloat(player.DefensiveClass);

    new_stats.GoalkeepingClass = parseFloat(player.GoalkeepingClass);
  } else if (position == "DEF") {
    // [1] ...for Defenders

    avg_points = points / 6;

    new_stats.average_points = avg_points;

    // Check to see if the player's avg_points are 2 or below
    if (avg_points <= 2) {
      new_stats.DefensiveClassIncrement = -1;
      new_stats.AttackingClassIncrement = -1;
    } else {
      new_stats.AttackingClassIncrement = (avg_points / 100) * 30;
      new_stats.DefensiveClassIncrement = (avg_points / 100) * 70;
    }

    new_stats.AttackingClass =
      new_stats.AttackingClassIncrement + parseFloat(player.AttackingClass);

    new_stats.DefensiveClass =
      new_stats.DefensiveClassIncrement + parseFloat(player.DefensiveClass);

    new_stats.GoalkeepingClass = parseFloat(player.GoalkeepingClass);
  } else if (position == "GK") {
    // [1] ...for Goalkeepers

    avg_points = points / 6;

    new_stats.average_points = avg_points;

    // Check if a player's points are 2 or below
    if (avg_points <= 2) {
      new_stats.DefensiveClassIncrement = -1;
      new_stats.AttackingClassIncrement = -1;
      new_stats.GoalkeepingClassIncrement = -1;
    } else {
      new_stats.AttackingClassIncrement = (avg_points / 100) * 5;
      new_stats.DefensiveClassIncrement = (avg_points / 100) * 5;
      new_stats.GoalkeepingClassIncrement = (avg_points / 100) * 90;
    }

    new_stats.AttackingClass =
      new_stats.AttackingClassIncrement + parseFloat(player.AttackingClass);

    new_stats.DefensiveClass =
      new_stats.DefensiveClassIncrement + parseFloat(player.DefensiveClass);

    new_stats.GoalkeepingClass =
      new_stats.GoalkeepingClassIncrement + parseFloat(player.GoalkeepingClass);
  }

  return new_stats;
}

// Function to calculate the total skill points of a player.
function totalSkillPoints(squad, skill_point) {
  let sums = squad.reduce((sum, player) => {
    return sum + parseInt(player[skill_point]);
  }, 0);
  return sums;
}

// Function to calculate the total points by skill for the club.
function clubsTotalPoints(clubs) {
  clubs.forEach((c, i) => {
    c.TotalAC = totalSkillPoints(c.Squad, "AttackingClass");
    c.TotalDC = totalSkillPoints(c.Squad, "DefensiveClass");
    c.TotalGC = totalSkillPoints(c.Squad, "GoalkeepingClass");
  });
}

// Function to sum the total goals in the season.
function totalGoalsInSeason(standings) {
  return standings.reduce((sum, club) => {
    return sum + club.GF;
  }, 0);
}

// Function to calculate rating for a player.
function calculateRating(position, attacking_class, defensive_class, gk_class) {
  let rating;
  if (position == "ATT") {
    rating = Math.round(
      (attacking_class / 99) * 80 + (((defensive_class / 99) * 20) / 100) * 99
    );
  } else if (position == "DEF") {
    rating = Math.round(
      (defensive_class / 99) * 80 + (((attacking_class / 99) * 20) / 100) * 99
    );
  } else if (position == "MID") {
    rating = Math.round(
      (defensive_class / 99) * 50 + (((attacking_class / 99) * 50) / 100) * 99
    );
  } else if (position == "GK") {
    rating = Math.round(
      (gk_class / 99) * 90 +
        (defensive_class / 99) * 5 +
        (((attacking_class / 99) * 5) / 100) * 99
    );
  }
  return rating;
}

// Accordion stuff...

function setUpAccordionListener() {
  var acc = document.getElementsByClassName("accordion");

  for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
}

function displayClubAccordion(clubs) {
  let club_accordion_el = document.getElementById("club-accordion");

  clubs.forEach((club, i) => {
    let club_button_el = document.createElement("button");
    club_button_el.setAttribute("class", "accordion");
    club_button_el.innerHTML = `<img src="/img/${club.ClubCode}.png"><span>${
      club.ClubCode
    }</span>`;

    // Make panel
    let club_panel_el = document.createElement("div");
    club_panel_el.setAttribute("class", "panel");
    // club_panel_el.innerHtml = `${
    //   club.Name
    // } players go here :) thank you Jesus!`;

    // Make List
    let squad_list = document.createElement("ul");
    squad_list.setAttribute("class", "list");

    club.Squad.forEach((player, i) => {
      let player_el = document.createElement("li");
      player_el.innerHTML = `<i>${player.Position}</i> - ${player.FirstName} ${
        player.LastName
      } <span>${player.AvgPoints.toFixed(2)}</span>`;

      squad_list.appendChild(player_el);
    });

    club_accordion_el.appendChild(club_button_el);
    club_panel_el.appendChild(squad_list);
    club_accordion_el.appendChild(club_panel_el);
  });

  setUpAccordionListener();
}

model.getSeason();
handlers.setUpEventListeners();
