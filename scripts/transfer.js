var clubs = [];

var model = {
  getClubs() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        clubs = JSON.parse(this.response).results;
        console.log(clubs);
      }
    };

    xhttp.open("GET", "/clubs/get/all/clubs", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
  }
};

model.getClubs();
