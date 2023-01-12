import {
  capitalizeFirstLetter,
  getUser,
  checkUserAdm,
  readAllDepartments,
  readAllusers,
  readAllCompanies,
  readDepartmentByCompany,
  readUsersOutOfWork,
  hireUser,
  dismissUser,
  editDepartment,
  removeDepartment,
  createNewDepartment,
  editUser,
  removeUser,
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

function createDepartmentCard({ name, description, companies, uuid }) {
  const departmentCard = document.createElement("li");
  const departmentName = document.createElement("h2");
  const departmentDescription = document.createElement("h3");
  const companyName = document.createElement("p");
  const buttonsDiv = document.createElement("div");
  const buttonView = document.createElement("img");
  const buttonEdit = document.createElement("img");
  const buttonDelete = document.createElement("img");

  departmentCard.classList = "department__card";
  departmentCard.id = uuid;

  buttonsDiv.classList = "departments-buttons__container";

  buttonView.classList = "department-button--view";
  buttonView.src = "../img/eye-icon-purple.png";
  buttonView.alt = "Visualizar";

  buttonEdit.classList = "department-button--edit";
  buttonEdit.src = "../img/pen-icon.png";
  buttonEdit.alt = "editar";

  buttonDelete.classList = "department-button--remove";
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

function createUserCard({ username, professional_level, uuid }) {
  const userCard = document.createElement("li");
  const usernameCard = document.createElement("h2");
  const userProfessionalLevel = document.createElement("h3");
  const buttonsDiv = document.createElement("div");
  const buttonEdit = document.createElement("img");
  const buttonDelete = document.createElement("img");

  userCard.classList = "user__card";

  buttonsDiv.classList = "users-buttons__container";
  buttonsDiv.id = uuid;

  buttonEdit.classList = "user-button--edit";
  buttonEdit.src = "../img/pen-icon-purple.png";
  buttonEdit.alt = "editar";

  buttonDelete.classList = "user-button--remove";
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

function renderSelectCompanyOptions(companys, optionalSelect) {
  const select = document.querySelector("#company");

  if (optionalSelect) {
    companys.forEach((company) => {
      optionalSelect.insertAdjacentHTML(
        "beforeend",
        `<option value=${company.uuid}>${company.name}</option>`
      );
    });
  } else {
    companys.forEach((company) => {
      select.insertAdjacentHTML(
        "beforeend",
        `<option value=${company.uuid}>${company.name}</option>`
      );
    });
  }
}

function renderSelectedCompanys() {
  const select = document.querySelector("#company");

  select.addEventListener("change", async () => {
    const companyDepartments = await readDepartmentByCompany(select.value);

    renderDepartmentsList(companyDepartments);
    viewDepartmentModal();
  });
}

function getDepartmentByButton(button) {
  const department = {};

  department.name = button.parentNode.parentElement.children[0].innerText;

  department.description =
    button.parentNode.parentElement.children[1].innerText;

  department.id = button.parentNode.parentElement.id;
  department.company = button.parentNode.parentElement.children[2].innerText;

  return department;
}

function getUserByButton(button) {
  const user = {};

  user.id = button.parentElement.id;

  user.username = button.parentElement.parentElement.children[0].innerText;

  return user;
}

function viewDepartmentModal() {
  const viewDepartmentButtons = document.querySelectorAll(
    ".department-button--view"
  );

  const viewDepartmentModal = document.querySelector(".view-department__modal");

  viewDepartmentButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();

      const department = getDepartmentByButton(button);

      viewDepartmentModal.innerHTML = "";
      createViewDepartmentModal(department);

      renderDepartmentsUsers(department.id, department.company);
      renderUsersOutofWorkOptions(await readUsersOutOfWork());
      hireUserButton();
      dismissUserButton();

      viewDepartmentModal.showModal();
    });
  });
}

function createViewDepartmentModal({ name, description, company, id }) {
  const viewDepartmentDialog = document.querySelector(
    ".view-department__modal"
  );
  viewDepartmentDialog.innerHTML = "";

  const modalCloseButton = document.createElement("img");
  const modalForm = document.createElement("form");

  modalCloseButton.src = "../img/x-icon.png";
  modalCloseButton.alt = "fechar";
  modalCloseButton.addEventListener("click", (e) => {
    e.preventDefault();
    viewDepartmentDialog.close();
  });

  modalForm.method = "dialog";
  modalForm.classList = "view-department__form";

  modalForm.innerHTML = "";

  modalForm.innerHTML = `
  <form class="view-department__form" method="dialog">
    <h2>${name}</h2>
    <div class="view-department__container">
      <div class="view-department--info">
        <h2>${description}</h2>
        <p>${company}</p>
      </div>
      <div class="view-department--function">
        <select name="worker" id="worker">
          <option value="">Selecionar Usuário</option>
        </select>
        <button id="${id}" class="button--hire">Contratar</button>
      </div>
    </div>
    <ul class="department-users__list"></ul>
  </form>
  `;

  viewDepartmentDialog.append(modalCloseButton, modalForm);
}

async function filterUserByDepartment(departmentID) {
  const usuarios = await readAllusers();

  const departmentUsers = usuarios.filter((usuario) => {
    return usuario.department_uuid == departmentID;
  });

  return departmentUsers;
}

async function renderDepartmentsUsers(department, company) {
  const departmentUsersList = document.querySelector(".department-users__list");

  departmentUsersList.innerHTML = "";

  const departmentUsers = await filterUserByDepartment(department);
  if (departmentUsers.length > 0) {
    departmentUsers.forEach(({ uuid, username, professional_level }) => {
      departmentUsersList.insertAdjacentHTML(
        "beforeend",
        `
        <li class="department-user__card">
        <h2>${username}</h2>
        <h3>${professional_level}</h3>
        <p>${company}</p>
        <div>
          <button id="${uuid}"class="button--dismiss">Desligar</button>
        </div>
      </li>
        `
      );
    });
  } else if (departmentUsers.length == 0) {
    departmentUsersList.insertAdjacentHTML(
      "beforeend",
      `
      <h2>Nenhum usuário registrado nesse departamento</h2>
      `
    );
  }
}

function renderUsersOutofWorkOptions(users) {
  const option = document.querySelector("#worker");

  option.innerHTML = `<option value="">Selecionar Usuário</option`;
  if (option) {
    users.forEach((user) => {
      option.insertAdjacentHTML(
        "beforeend",
        `<option value=${user.uuid}>${user.username}</option>`
      );
    });
  }
}

function hireUserButton() {
  const hireButton = document.querySelector(".button--hire");

  hireButton.addEventListener("click", async (e) => {
    const hireBody = {};
    hireBody.user_uuid = hireButton.form[0].value;
    hireBody.department_uuid = hireButton.id;

    await hireUser(hireBody);
  });
}

function dismissUserButton() {
  const dismissButtons = document.querySelectorAll(".button--dismiss");

  dismissButtons.forEach((dismissButton) => {
    dismissButton.addEventListener("click", async (e) => {
      const userID = dismissButton.id;
      await dismissUser(userID);
    });
  });
}

function editDepartmentModal() {
  const editDepartmentButtons = document.querySelectorAll(
    ".department-button--edit"
  );

  const editDepartmentModal = document.querySelector(".edit-department__modal");

  editDepartmentButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const department = getDepartmentByButton(button);

      editDepartmentModal.innerHTML = "";
      createEditDepartmentModal(department);
      editDepartmentModal.showModal();
    });
  });
}

function createEditDepartmentModal({ description, id }) {
  const editDepartmentDialog = document.querySelector(
    ".edit-department__modal"
  );

  const modalCloseButton = document.createElement("img");
  const modalForm = document.createElement("form");
  const modalTitle = document.createElement("h2");
  const modalDepartmentDescription = document.createElement("textarea");
  const modalSubmitButton = document.createElement("button");

  modalCloseButton.src = "../img/x-icon.png";
  modalCloseButton.alt = "fechar";
  modalCloseButton.addEventListener("click", (e) => {
    e.preventDefault();
    editDepartmentDialog.close();
  });

  modalForm.classList = "edit-department__form";
  modalForm.method = "dialog";

  modalTitle.innerText = "Editar Departamento";

  modalDepartmentDescription.placeholder = description;

  modalSubmitButton.innerText = "Salvar Alterações";
  modalSubmitButton.addEventListener("click", (e) => {
    e.preventDefault();
    const editBody = {};
    editBody.description = modalDepartmentDescription.value;

    editDepartment(editBody, id);
    editDepartmentDialog.close();
  });
  modalForm.append(modalTitle, modalDepartmentDescription, modalSubmitButton);
  editDepartmentDialog.append(modalCloseButton, modalForm);
}

function removeDepartmentModal() {
  const removeDepartmentButtons = document.querySelectorAll(
    ".department-button--remove"
  );

  const removeDepartmentModal = document.querySelector(
    ".remove-department__modal"
  );

  removeDepartmentButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const department = getDepartmentByButton(button);

      removeDepartmentModal.innerHTML = "";
      createRemoveDepartmentModal(department);
      removeDepartmentModal.showModal();
    });
  });
}

function createRemoveDepartmentModal({ name, id }) {
  const removeDepartmentDialog = document.querySelector(
    ".remove-department__modal"
  );

  const modalCloseButton = document.createElement("img");
  const modalForm = document.createElement("form");
  const modalTitle = document.createElement("h2");
  const modalSubmitButton = document.createElement("button");

  modalCloseButton.src = "../img/x-icon.png";
  modalCloseButton.alt = "fechar";
  modalCloseButton.addEventListener("click", (e) => {
    e.preventDefault();
    removeDepartmentDialog.close();
  });

  modalForm.classList = "remove-department__form";
  modalForm.method = "dialog";

  modalTitle.innerText = `Realmente deseja deletar o Departamento ${name} e demitir seus funcionários?`;

  modalSubmitButton.innerText = "Confirmar";
  modalSubmitButton.addEventListener("click", (e) => {
    e.preventDefault();

    removeDepartment(id);
    removeDepartmentDialog.close();
  });

  modalForm.append(modalTitle, modalSubmitButton);

  removeDepartmentDialog.append(modalCloseButton, modalForm);
}

function newDepartmentModal() {
  const newDepartmentButton = document.querySelector(".department-button--new");

  const newDepartmentModal = document.querySelector(".new-department__modal");

  newDepartmentButton.addEventListener("click", () => {
    newDepartmentModal.innerHTML = "";
    createNewDepartmentModal();
    newDepartmentModal.showModal();
  });
}

async function createNewDepartmentModal() {
  const newDepartmentDialog = document.querySelector(".new-department__modal");

  const modalCloseButton = document.createElement("img");
  const modalForm = document.createElement("form");
  const modalTitle = document.createElement("h2");
  const modalDepartmentNameInput = document.createElement("input");
  const modalDepartmentDescriptionInput = document.createElement("input");
  const modalCompanySelect = document.createElement("select");
  const modalCompanyOption = document.createElement("option");
  const modalSubmitButton = document.createElement("button");

  modalCloseButton.src = "../img/x-icon.png";
  modalCloseButton.alt = "fechar";
  modalCloseButton.addEventListener("click", (e) => {
    e.preventDefault();
    newDepartmentDialog.close();
  });

  modalForm.classList = "new-department__form";
  modalForm.method = "dialog";

  modalTitle.innerText = "Criar Departamento";

  modalDepartmentNameInput.placeholder = "Nome do departamento";
  modalDepartmentDescriptionInput.placeholder = "Descrição";

  modalCompanyOption.innerText = "Selecionar empresa";

  modalCompanyOption.innerText = "Selecionar empresa";

  modalSubmitButton.innerText = "Criar o departamento";
  modalSubmitButton.addEventListener("click", (e) => {
    e.preventDefault();
    const newDepartmentBody = {};
    newDepartmentBody.name = modalDepartmentNameInput.value;

    newDepartmentBody.description = modalDepartmentDescriptionInput.value;

    newDepartmentBody.company_uuid = modalCompanySelect.value;

    createNewDepartment(newDepartmentBody);
    newDepartmentDialog.close();
  });

  modalCompanySelect.append(modalCompanyOption);

  renderSelectCompanyOptions(await readAllCompanies(), modalCompanySelect);

  modalForm.append(
    modalTitle,
    modalDepartmentNameInput,
    modalDepartmentDescriptionInput,
    modalCompanySelect,
    modalSubmitButton
  );

  newDepartmentDialog.append(modalCloseButton, modalForm);
}

function editUserModal() {
  const editButtons = document.querySelectorAll(".user-button--edit");

  const editUserModal = document.querySelector(".edit-user__modal");

  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const user = getUserByButton(button);

      editUserModal.innerHTML = "";
      createEditUserModal(user.id);
      editUserModal.showModal();
    });
  });
}

function createEditUserModal(id) {
  const editUserDialog = document.querySelector(".edit-user__modal");

  const modalCloseButton = document.createElement("img");
  const modalForm = document.createElement("form");
  const modalTitle = document.createElement("h2");
  const modalUserJobSelect = document.createElement("select");
  const modalUserProfessionalLevelSelect = document.createElement("select");

  const modalSubmitButton = document.createElement("button");

  modalCloseButton.src = "../img/x-icon.png";
  modalCloseButton.alt = "fechar";
  modalCloseButton.addEventListener("click", (e) => {
    e.preventDefault();
    editUserDialog.close();
  });

  modalForm.classList = "new-department__form";
  modalForm.method = "dialog";

  modalTitle.innerText = "Editar Usuário";

  modalUserJobSelect.innerHTML = `
  <option value="">Selecionar modalidade de trabalho</option>
  <option value="home office">Home office</option>
  <option value="presencial">Presencial</option>
  <option value="hibrido">Híbrido</option>
  `;
  modalUserProfessionalLevelSelect.innerHTML = `
  <option value="">Selecione nível profissional</option>
  <option value="estágio">Estágio</option>
  <option value="júnior">Júnior</option>
  <option value="pleno">Pleno</option>
  <option value="sênior">Sênior</option>
  `;
  modalSubmitButton.innerText = "Editar";
  modalSubmitButton.id = id;
  modalSubmitButton.addEventListener("click", (e) => {
    e.preventDefault();

    const newUserInformation = {};
    newUserInformation.kind_of_work = modalUserJobSelect.value;

    newUserInformation.professional_level =
      modalUserProfessionalLevelSelect.value;

    editUser(newUserInformation, modalSubmitButton.id);
    editUserDialog.close();
  });

  modalForm.append(
    modalTitle,
    modalUserJobSelect,
    modalUserProfessionalLevelSelect,
    modalSubmitButton
  );

  editUserDialog.append(modalCloseButton, modalForm);
}

function removeUserModal() {
  const removeUserButtons = document.querySelectorAll(".user-button--remove");

  const removeUserModal = document.querySelector(".remove-user__modal");

  removeUserButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const user = getUserByButton(button);
      console.log(user);
      removeUserModal.innerHTML = "";
      createRemoveUserModal(user);
      removeUserModal.showModal();
    });
  });
}

function createRemoveUserModal({ id, username }) {
  const removeUserDialog = document.querySelector(".remove-user__modal");

  const modalCloseButton = document.createElement("img");
  const modalForm = document.createElement("form");
  const modalTitle = document.createElement("h2");
  const modalSubmitButton = document.createElement("button");

  modalCloseButton.src = "../img/x-icon.png";
  modalCloseButton.alt = "fechar";
  modalCloseButton.addEventListener("click", (e) => {
    e.preventDefault();
    removeUserDialog.close();
  });

  modalForm.classList = "remove-user__form";
  modalForm.method = "dialog";

  modalTitle.innerText = `Realmente deseja remover o usuário ${username}?`;

  modalSubmitButton.innerText = "Deletar";
  modalSubmitButton.addEventListener("click", (e) => {
    e.preventDefault();

    removeUser(id);
    removeUserDialog.close();
  });

  modalForm.append(modalTitle, modalSubmitButton);

  removeUserDialog.append(modalCloseButton, modalForm);
}

renderAdminDashboard();
renderDepartmentsList(await readAllDepartments());
renderUsersList(await readAllusers());
renderSelectCompanyOptions(await readAllCompanies());
renderSelectedCompanys();

viewDepartmentModal();
editDepartmentModal();
removeDepartmentModal();
newDepartmentModal();
editUserModal();
removeUserModal();
