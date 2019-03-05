// Hiii!
let match_code;
var model = {
  getMatch() {
    match_code = document.URL.split("/")[4];
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        console.log(xhttp.response);
      }
    };

    xhttp.open("GET", `/match/get/${match_code}/stats`, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
  }
};

model.getMatch();
