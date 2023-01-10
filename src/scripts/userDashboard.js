import { getUser, checkUserAdm, userInformations } from "./requests.js";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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

async function renderCompanyInformations() {
  const userInfo = await userInformations();
}

async function editUserModal() {
  const main = document.querySelector(".main__container");
  const userEditModal = document.querySelector(".user-edit-info__modal");
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

async function editInformation() {}

renderUserDashboard();
renderUserInformations();
renderCompanyInformations();
editUserModal();
