// Hiii!
let match_code;
let fixture;
let clubs;
let home_players;
let away_players;
var model = {
  getMatch() {
    match_code = document.URL.split("/")[4];
    match_number = document.URL.split("/")[5];
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        fixture = JSON.parse(xhttp.response);
        model.getClubs();
      }
    };

    xhttp.open("GET", `/match/get/${match_code}/${match_number}/stats`, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
  },
  getClubs() {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        clubs = JSON.parse(xhttp.response);
        home_players = clubs[0].Players;
        away_players = clubs[1].Players;
        view.displayFormation(home_players, away_players);
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
    p3_2_1: [3, 15, 17, 19, 23, 25, 31]
  }
};

var view = {
  displayFormation(home, away) {
    // Regular formation:
    // 1-3-2-1
    let formation_table = document.getElementsByName("formation");
    home_players.sort((a,b)=>{
      return a.PositionNumber - b.PositionNumber;
    });
    away_players.sort((a,b)=>{
      return a.PositionNumber - b.PositionNumber;
    });
  
  }
};


model.getMatch();
