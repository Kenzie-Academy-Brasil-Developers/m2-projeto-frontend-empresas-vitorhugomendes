import {
  capitalizeFirstLetter,
  getUser,
  checkUserAdm,
  readAllDepartments,
  readAllusers,
  readAllCompanies,
  readDepartmentByCompany,
} from "./requests.js";

async function renderAdminDashboard() {
  const user = getUser();
  if (!user) {
    window.location.replace("/");
  } else if (!(await checkUserAdm())) {
    window.location.replace("./userDashboard.html");
  }
}

function renderDepartmentsList(departments) {
  const departmentsList = document.querySelector(".departments__list");

  departmentsList.innerHTML = "";

  if (!departments[0]) {
    departmentsList.insertAdjacentHTML(
      "beforeend",
      "<h2>Nenhum departamento encontrado</h2>"
    );
  }

  departments.forEach((department) => {
    const departmentCard = createDepartmentCard(department);

    departmentsList.appendChild(departmentCard);
  });
}

function createDepartmentCard({ name, description, companies }) {
  const departmentCard = document.createElement("li");
  const departmentName = document.createElement("h2");
  const departmentDescription = document.createElement("h3");
  const companyName = document.createElement("p");
  const buttonsDiv = document.createElement("div");
  const buttonView = document.createElement("img");
  const buttonEdit = document.createElement("img");
  const buttonDelete = document.createElement("img");

  departmentCard.classList = "department__card";

  buttonsDiv.classList = "departments-buttons__container";

  buttonView.classList = "department-button--view";
  buttonView.src = "../img/eye-icon-purple.png";
  buttonView.alt = "Visualizar";

  buttonEdit.classList = "department-button--edit";
  buttonEdit.src = "../img/pen-icon.png";
  buttonEdit.alt = "editar";

  buttonDelete.classList = "department-button--delete";
  buttonDelete.src = "../img/trash-icon.png";
  buttonDelete.alt = "excluir";

  departmentName.innerText = name;
  departmentDescription.innerText = description;
  companyName.innerText = companies.name;

  buttonsDiv.append(buttonView, buttonEdit, buttonDelete);

  departmentCard.append(
    departmentName,
    departmentDescription,
    companyName,
    buttonsDiv
  );

  return departmentCard;
}

function renderUsersList(users) {
  const usersList = document.querySelector(".users__list");

  usersList.innerHTML = "";

  users.forEach((user) => {
    const { is_admin } = user;
    if (!is_admin) {
      const userCard = createUserCard(user);

      usersList.appendChild(userCard);
    }
  });
}

function createUserCard({ username, professional_level }) {
  const userCard = document.createElement("li");
  const usernameCard = document.createElement("h2");
  const userProfessionalLevel = document.createElement("h3");
  const buttonsDiv = document.createElement("div");
  const buttonEdit = document.createElement("img");
  const buttonDelete = document.createElement("img");

  userCard.classList = "user__card";

  buttonsDiv.classList = "users-buttons__container";

  buttonEdit.classList = "user-button--edit";
  buttonEdit.src = "../img/pen-icon-purple.png";
  buttonEdit.alt = "editar";

  buttonDelete.classList = "user-button--delete";
  buttonDelete.src = "../img/trash-icon.png";
  buttonDelete.alt = "excluir";

  usernameCard.innerText = username;

  if (!professional_level) {
    userProfessionalLevel.innerText = "Indefinido";
  } else {
    userProfessionalLevel.innerText = capitalizeFirstLetter(professional_level);
  }

  buttonsDiv.append(buttonEdit, buttonDelete);

  userCard.append(usernameCard, userProfessionalLevel, buttonsDiv);

  return userCard;
}

function renderSelectCompanyOptions(companys) {
  const select = document.querySelector("#company");

  companys.forEach((company) => {
    select.insertAdjacentHTML(
      "beforeend",
      `<option value=${company.uuid}>${company.name}</option>`
    );
  });
}

function renderSelectedCompanys() {
  const select = document.querySelector("#company");

  select.addEventListener("change", async () => {
    const companyDepartments = await readDepartmentByCompany(select.value);

    renderDepartmentsList(companyDepartments);
  });
}

function viewDepartmentModal() {
  const viewDepartmentButtons = document.querySelectorAll(
    ".department-button--view"
  );
  const viewDepartmentCloseButton = document.querySelector(
    ".view-department-modal--close"
  );
  const viewDepartmentModal = document.querySelector(".view-department__modal");

  viewDepartmentButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      viewDepartmentModal.showModal();
    });

    viewDepartmentCloseButton.addEventListener("click", () => {
      viewDepartmentModal.close();
    });
  });
}

renderAdminDashboard();
renderDepartmentsList(await readAllDepartments());
renderUsersList(await readAllusers());
renderSelectCompanyOptions(await readAllCompanies());
renderSelectedCompanys();

viewDepartmentModal();
