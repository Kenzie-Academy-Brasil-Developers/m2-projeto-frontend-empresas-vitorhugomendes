function showHideButtons() {
  const menuButton = document.querySelector(".header-button--menu");
  const sectionButtons = document.querySelector(".header-buttons__container");

  menuButton.addEventListener("click", () => {
    sectionButtons.classList.toggle("menu--dropdown");
  });
}

showHideButtons();