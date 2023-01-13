import {
  capitalizeFirstLetter,
  getUser,
  checkUserAdm,
  userInformations,
  userUpdateUserInformation,
  loggedUserDepartments,
  userCoworkers,
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

  if (userInfo.department_uuid) {
    renderUserCompany();
  }
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

async function renderUserCompany() {
  const companySection = document.querySelector(".company-info-empty__section");
  companySection.classList = "company-info__section";

  const userDepartment = await loggedUserDepartments();

  companySection.innerHTML = ` 
<div class="company-info-title__container">
  <h2>${userDepartment.name} - ${userDepartment.departments[0].name}</h2>
</div>
<ul class="coworkers__list">
</ul>`;
  renderUserCoworkers();
}

async function renderUserCoworkers() {
  const coworkersList = document.querySelector(".coworkers__list");

  const coworkers = await userCoworkers();

  const userTitle = document.querySelector(".user-info__container > h2");

  const username = userTitle.innerText;

  coworkers.forEach((coworker) => {
    if (coworker.username != username) {
      coworkersList.insertAdjacentHTML(
        "afterbegin",
        `          
  <li class="coworker__card">
    <h2>${coworker.username}</h2>
    <h3>${capitalizeFirstLetter(coworker.professional_level)}</h3>
  </li>`
      );
    }
  });
}

renderUserDashboard();
renderUserInformations();
userModal();
editInformation();
