// Hi! Here you select the kind of match you want to play :)

var controller = {
  newSeason() {
    let main_setup = document.getElementById("main_setup");
    main_setup.innerHTML = `<h3>Please select league</h3>
        <form class="form-control" action="/match/setup" method="GET">
            <select id="league_select" class="form-control select">
                    <option value="3" name="league_select"
                      >Bellean Football League III</option
                    >
                    <option value="2" name="league_select">Epson League II</option>
                    <option value="1" name="league_select">Epson League I</option>
                  </select>
                <label for="match_title">Match/Season Title</label>
                <input name="season_title" class="form-control" type="text" placeholder="Season Title e.g '17-24-Feb-19'">
                <input name="season_code" class="form-control" type="text" placeholder="Season code e.g 'S021'">
                <input type="submit" class="btn btn-primary-outline">New Season</input>
        </form>`;
  }
};

var handlers = {
  setUpEventListeners
};
