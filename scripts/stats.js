let selected_season;
let season_long_code = document.URL.split("/")[6];
let standings;
let league_result;
let player_rankings = {
  TopScorer: "",
  TopAssists: "",
  MostCleanSheets: ""
}

var model = {
  getSeason() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        selected_season = JSON.parse(xhttp.response);
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
  setLeagueResults(){
    league_result.Winner = standings[0];
    league_result.Relegated = standings[length - 1];
  }
};

model.getSeason();
