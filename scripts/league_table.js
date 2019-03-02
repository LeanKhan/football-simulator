// League Tables
var selected_league = "";
var selected_league_code = "";
var seasons;
var standings = [];

var model = {
  getLatestSeason(league_code) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        seasons = JSON.parse(xhttp.response);
        // standings = seasons[0].Standings;
        model.sortStandings(seasons[0].Standings);

        // view.displayStandings(seasons[0].Standings);
      }
    };
    xhttp.open("GET", `/data/league/${league_code}/seasons`, true);
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
    console.log(standings);
    view.displayStandings(standings);
  }
};

var view = {
  displayStandings(standings) {
    let tbody = document.getElementById("tbody");
    view.clearTable();
    standings.forEach((team, i) => {
      // Create Elements
      let tr = document.createElement("tr");
      let pos = document.createElement("td");
      let club_element = document.createElement("td");
      let played = document.createElement("td");
      let w = document.createElement("td");
      let l = document.createElement("td");
      let d = document.createElement("td");
      let gf = document.createElement("td");
      let ga = document.createElement("td");
      let gd = document.createElement("td");
      let points_element = document.createElement("td");

      pos.innerHTML = `<b>${i + 1}</b>`;
      club_element.innerHTML = `<img src='/img/${
        team.TeamCode
      }.png' height='45px'><span>${team.Team}</span>`;
      played.innerHTML = `${team.Played}`;
      w.innerHTML = `${team.Wins}`;
      l.innerHTML = `${team.Losses}`;
      d.innerHTML = `${team.Draws}`;
      gf.innerHTML = `${team.GF}`;
      ga.innerHTML = `${team.GA}`;
      gd.innerHTML = `${team.GD}`;
      points_element.innerHTML = `${team.Points}`;

      // Conditions

      if (i == 0) {
        tr.setAttribute("class", "bg-success");
      } else if (i == standings.length - 1) {
        tr.setAttribute("class", "bg-warning");
      }

      tr.appendChild(pos);
      tr.appendChild(club_element);
      tr.appendChild(played);
      tr.appendChild(w);
      tr.appendChild(l);
      tr.appendChild(d);
      tr.appendChild(gf);
      tr.appendChild(ga);
      tr.appendChild(gd);
      tr.appendChild(points_element);

      tbody.appendChild(tr);
    });
  },
  clearTable() {
    let tbody = document.getElementById("tbody");
    tbody.innerHTML = "";
  }
};

var handlers = {
  setUpEventListeners: () => {
    let league_selection_elements = document.getElementsByName("league_select");
    let league_logo_element = document.getElementById("league_logo");
    let league_name_element = document.getElementById("league_name");

    league_selection_elements.forEach((el, key) => {
      el.addEventListener("click", ev => {
        league_logo_element.innerHTML = `<img src="/img/L${
          ev.target.value
        }.png" height="72px">`;
        selected_league = ev.target.innerText;
        selected_league_code = "L" + ev.target.value;
        league_name_element.innerText = selected_league;
        switch (key) {
          case 0:
            model.getLatestSeason("L3");
            break;
          case 1:
            model.getLatestSeason("L2");
            break;
          case 2:
            model.getLatestSeason("L1");
            break;
        }
      });
    });
  }
};

handlers.setUpEventListeners();
