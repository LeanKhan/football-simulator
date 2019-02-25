var season = {};

// Array of clubs in selected league

var clubs = [];

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
  }
};

var view = {
  displayFixtures() {
    let list = document.getElementById("list");
    clubs.forEach((club, i) => {
      list_item = document.createElement("li");
      home = document.createElement("span");
      away = document.createElement("span");

      home.innerHTML = `${club.ClubCode}`;
    });
  }
};

var controller = {
  getClubs(league) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        return xhttp.response;
      }
    };

    xhttp.open("GET", `/data/clubs/${league}`, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
  }
};

model.getCompetionDetails();
