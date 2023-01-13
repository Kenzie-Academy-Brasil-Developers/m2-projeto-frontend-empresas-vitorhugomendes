function showHideButtons() {
  const menuButton = document.querySelector(".header-button--menu");
  const sectionButtons = document.querySelector(".header-buttons__container");

  menuButton.addEventListener("click", () => {
    sectionButtons.classList.toggle("menu--dropdown");
  });
}

function pageRedirectButtons() {
  const buttons = document.querySelectorAll(
    ".header-buttons__container > div> button"
  );

  buttons.forEach((button) => {
    if (button.innerText == "Login") {
      button.addEventListener("click", () => {
        window.location.replace("/src/pages/login.html");
      });
    } else if (button.innerText == "Cadastro") {
      button.addEventListener("click", () => {
        window.location.replace("/src/pages/register.html");
      });
    } else if (button.innerText == "Home") {
      button.addEventListener("click", () => {
        window.location.replace("/");
      });
    } else if (button.innerText == "Logout") {
      button.addEventListener("click", () => {
        localStorage.removeItem("@kenzieEmpresas:user");
        window.location.replace("/");
      });
    }
  });
}
pageRedirectButtons();
showHideButtons();
