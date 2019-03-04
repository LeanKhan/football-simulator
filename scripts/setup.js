// Hi! Here you select the kind of match you want to play :)

var controller = {
  newSeason() {
    let main_setup = document.getElementById("main_setup");
    main_setup.innerHTML = `<h3>Please select league</h3>
        <form class="form-control" action="/data/new/season" method="GET">
            <select id="league_select" class="form-control select" name="league_code">
                    <option value="L3" name="league_select"
                      >Bellean Football League III</option
                    >
                    <option value="L2" name="league_select">Epson League II</option>
                    <option value="L1" name="league_select">Epson League I</option>
                  </select>
                <label for="match_title">Match/Season Title</label>
                <input name="season_title" class="form-control" type="text" placeholder="Season Title e.g '17-24-Feb-19'">
                <input name="season_code" class="form-control" type="text" placeholder="Season code e.g 'S021'">
                <input type="submit" class="btn btn-primary-outline">New Season</input>
        </form>`;
  },
  newClub() {
    let main_setup = document.getElementById("main_setup");
    main_setup.innerHTML = ` <form class="form-control" action="/data/new/club" method="POST" name="club_details">
      <select class="form-control select" name="league_code">
              <option value="L3" name="league_select"
                >Bellean Football League III</option
              >
              <option value="L2" name="league_select">Epson League II</option>
              <option value="L1" name="league_select">Epson League I</option>
            </select>
          <label for="match_title">Match/Season Title</label>
          <input name="club_name" class="form-control" type="text" placeholder="Club name e.g 'Binatone F.C'">
          <input name="club_code" class="form-control" type="text" placeholder="Club code e.g 'BFC'">
          <input name="club_attacking_class" class="form-control" type="number" min="1" max="12" placeholder="Attacking Class">
          <input name="club_defensive_class" class="form-control" type="number" min="1" max="12" placeholder="Defensive Class"><br>
          <input name="manager_name" class="form-control" type="text" placeholder="Managers name e.g 'Szanzu Batfish'">
          <input name="stadium_name" class="form-control" type="text" placeholder="Stadium name e.g 'Central Park'">
          <input type="submit" class="btn btn-primary-outline">New Club</input>
  </form>`;
  },
  newPlayer(){
    let main_setup
  }
};
