import { register } from "./requests.js";

function registerForm() {
  const inputs = document.querySelectorAll(".register__form >  input");
  const select = document.querySelector("#professionalLevel");
  const button = document.querySelector(".register-button--register");

  const registerUser = {};

  button.addEventListener("click", async (event) => {
    event.preventDefault();

    inputs.forEach((input) => {
      registerUser[input.name] = input.value;
    });

    if (select.value != "") {
      registerUser[select.name] = select.value;
    }
    await register(registerUser);
  });
}

registerForm();
