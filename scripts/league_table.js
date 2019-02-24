var handlers = {
  setUpEventListeners: () => {
    let league_selection_elements = document.getElementsByName("league_select");
    let league_logo_element = document.getElementById("league_logo");

    league_selection_elements.forEach((el, key) => {
      el.addEventListener("click", ev => {
        league_logo_element.innerHTML = `<img src="/img/league${
          ev.target.value
        }_logo.png" height="72px">`;
      });
    });
  }
};
