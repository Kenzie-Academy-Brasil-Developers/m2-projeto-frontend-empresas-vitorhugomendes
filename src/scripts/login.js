import { getUser, login } from "./requests.js";

function renderLogin() {
  const user = getUser();
  if (user) {
    window.location.replace("/");
  }
}

function loginForm() {
  const inputs = document.querySelectorAll(".login__form >  input");
  const button = document.querySelector(".login-button--login");

  const loginUser = {};

  button.addEventListener("click", async (event) => {
    event.preventDefault();
    inputs.forEach((input) => {
      loginUser[input.name] = input.value;
    });

    const request = await login(loginUser);

    localStorage.setItem("@kenzieEmpresas:user", JSON.stringify(request));
  });
}

renderLogin();
loginForm();
