let selected_season;
let season_long_code = document.URL.split("/")[6];
let standings;
let players;
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

model.getSeason();
