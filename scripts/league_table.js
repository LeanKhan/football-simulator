// League Tables
var selected_league = "";
var selected_league_code = "";
var seasons;

var model = {
  getLatestSeason(league_code) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        seasons = JSON.parse(xhttp.response);
      }
    };
    xhttp.open("GET", `/data/league/${league_code}/seasons`, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
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
