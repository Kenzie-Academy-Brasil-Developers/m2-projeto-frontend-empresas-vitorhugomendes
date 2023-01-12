import {
  capitalizeFirstLetter,
  getUser,
  checkUserAdm,
  userInformations,
  userUpdateUserInformation,
} from "./requests.js";

async function renderUserDashboard() {
  const user = getUser();
  if (!user) {
    window.location.replace("/");
  } else if (await checkUserAdm()) {
    window.location.replace("./admDashboard.html");
  }
}

async function renderUserInformations() {
  const userInfoContainer = document.querySelector(".user-info__container");

  const userInfo = await userInformations();

  let { email } = userInfo;
  let { professional_level } = userInfo;
  let { kind_of_work } = userInfo;

  if (!professional_level) {
    professional_level = "";
  } else {
    professional_level = capitalizeFirstLetter(professional_level);
  }

  if (!kind_of_work) {
    kind_of_work = "";
  } else {
    kind_of_work = capitalizeFirstLetter(kind_of_work);
  }
  userInfoContainer.innerHTML = "";
  userInfoContainer.insertAdjacentHTML(
    "beforeend",
    `<h2>${userInfo.username}</h2>
  <div>
  <p>${email}</p>
  <p>${professional_level}</p>
  <p>${kind_of_work}</p>
  </div>
  `
  );
}

async function userModal() {
  const userEditModal = document.querySelector(".user__modal");
  const editButton = document.querySelector(".user-button--edit");
  const closeModalButton = document.querySelector(".button-modal--close");

  editButton.addEventListener("click", (e) => {
    e.preventDefault();
    userEditModal.showModal();
  });

  closeModalButton.addEventListener("click", () => {
    userEditModal.close();
  });
}

async function editInformation() {
  const editButton = document.querySelector(".button-modal--edit");
  const inputs = document.querySelectorAll(".user__modal > form > input");

  const editUser = {};

  editButton.addEventListener("click", async (event) => {
    event.preventDefault();

    inputs.forEach((input) => {
      editUser[input.name] = input.value;
    });

    await userUpdateUserInformation(editUser);
  });
}

renderUserDashboard();
renderUserInformations();
userModal();
editInformation();
