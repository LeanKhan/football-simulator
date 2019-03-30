let selected_season;
let season_long_code = document.URL.split("/")[6];
let standings;
let players;
let new_player_skill_points = [];
let league_result = {
  Winner: "",
  Relegated: ""
};
let player_rankings = {
  TopScorer: "",
  TopAssists: "",
  TopPoints: ""
};
let clubs = {};

var model = {
  getSeason() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        selected_season = JSON.parse(xhttp.response);
        players = selected_season.Players;
        this.sortStandings(selected_season.Standings);
        this.setLeagueResults();
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
    player_rankings.mostMOTM = sortPlayersByAspect(players, "MOTM")[0];
    this.arrangePlayersByClub();
  },
  arrangePlayersByClub() {
    standings.forEach((club, i) => {
      clubs[club.TeamCode] = players.filter((player, i) => {
        if (player.ClubCode == club.TeamCode) {
          return player;
        }
      });
    });
  }
};

function sortPlayersByAspect(players, aspect) {
  return players.sort((a, b) => {
    return b[aspect] - a[aspect];
  });
}

function collateNewSkillPoints() {
  players.forEach((player, i) => {
    new_player_skill_points.push(
      calculateNewSkillPoints(player, player.Position, player.Points)
    );
  });
}

function calculateNewSkillPoints(player, position, points) {
  let new_stats = {};
  let avg_points;
  new_stats.Player_ID = player.Player_ID;
  new_stats.Position = player.Position;
  if (position == "ATT") {
    avg_points = points / 6 / 2;

    new_stats.average_points = avg_points;

    new_stats.AttackingClassIncrement = (avg_points / 100) * 70;
    new_stats.AttackingClass =
      (avg_points / 100) * 70 + parseFloat(player.AttackingClass);

    new_stats.DefensiveClassIncrement = (avg_points / 100) * 30;
    new_stats.DefensiveClass =
      (avg_points / 100) * 30 + parseFloat(player.DefensiveClass);

    new_stats.GoalkeepingClass = parseFloat(player.GoalkeepingClass);
  } else if (position == "MID") {
    avg_points = points / 6 / 2;

    new_stats.average_points = avg_points;

    new_stats.AttackingClassIncrement = (avg_points / 100) * 50;
    new_stats.AttackingClass =
      (avg_points / 100) * 50 + parseFloat(player.AttackingClass);

    new_stats.DefensiveClassIncrement = (avg_points / 100) * 50;
    new_stats.DefensiveClass =
      (avg_points / 100) * 50 + parseFloat(player.DefensiveClass);

    new_stats.GoalkeepingClass = parseFloat(player.GoalkeepingClass);
  } else if (position == "DEF") {
    avg_points = points / 6 / 2;

    new_stats.average_points = avg_points;

    new_stats.AttackingClassIncrement = (avg_points / 100) * 30;
    new_stats.AttackingClass =
      (avg_points / 100) * 30 + parseFloat(player.AttackingClass);

    new_stats.DefensiveClassIncrement = (avg_points / 100) * 70;
    new_stats.DefensiveClass =
      (avg_points / 100) * 70 + parseFloat(player.DefensiveClass);

    new_stats.GoalkeepingClass = parseFloat(player.GoalkeepingClass);
  } else if (position == "GK") {
    avg_points = points / 6 / 2;

    new_stats.average_points = avg_points;

    new_stats.AttackingClassIncrement = (avg_points / 100) * 5;
    new_stats.AttackingClass =
      (avg_points / 100) * 5 + parseFloat(player.AttackingClass);

    new_stats.DefensiveClassIncrement = (avg_points / 100) * 5;
    new_stats.DefensiveClass =
      (avg_points / 100) * 5 + parseFloat(player.DefensiveClass);

    new_stats.GoalkeepingClassIncrement = (avg_points / 100) * 90;
    new_stats.GoalkeepingClass =
      (avg_points / 100) * 90 + parseFloat(player.GoalkeepingClass);
  }
  return new_stats;
}

model.getSeason();
