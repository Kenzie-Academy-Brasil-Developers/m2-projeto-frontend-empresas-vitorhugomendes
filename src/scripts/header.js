function showHideButtons() {
  const menuButton = document.querySelector(".header-button--menu");
  const sectionButtons = document.querySelector(".header-buttons__container");

  menuButton.addEventListener("click", () => {
    sectionButtons.classList.toggle("menu--dropdown");
  });
}

function pageRedirectButtons() {
  const buttons = document.querySelectorAll("button");

  buttons.forEach((button) => {
    if (button.innerText == "Login") {
      button.addEventListener("click", () => {
        window.location.replace("/src/pages/login.html");
      });
    } else if (button.innerText == "Cadastro") {
      button.addEventListener("click", () => {
        window.location.replace("/src/pages/register.html");
      });
    }
  });
}
pageRedirectButtons();
showHideButtons();
