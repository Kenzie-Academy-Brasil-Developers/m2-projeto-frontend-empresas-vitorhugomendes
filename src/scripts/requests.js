import { toast } from "./toast.js";

const user = getUser() || {};
const { token } = user;
const baseUrl = "http://localhost:6278";
const requestHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};
const red = "#CE4646";
const green = "#4BA036";

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export async function readAllCompanies() {
  const companies = await fetch(`${baseUrl}/companies`, {
    method: "GET",
    headers: requestHeaders,
  }).then((response) => {
    return response.json();
  });

  return companies;
}

export async function readAllCompaniesSectors() {
  const companiesSectors = await fetch(`${baseUrl}/sectors`, {
    method: "GET",
    headers: requestHeaders,
  }).then((response) => {
    return response.json();
  });

  return companiesSectors;
}

export async function readCompaniesBySector(sector) {
  const companiesBySector = await fetch(`${baseUrl}/companies/${sector}`, {
    method: "GET",
    headers: requestHeaders,
  }).then((response) => {
    return response.json();
  });

  return companiesBySector;
}

export function getUser() {
  const user = JSON.parse(localStorage.getItem("@kenzieEmpresas:user"));

  return user;
}

export async function login(data) {
  const loginData = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(data),
  }).then((response) => {
    return response.json();
  });

  if (loginData.error) {
    toast(loginData.error, red);
  } else {
    toast("Login realizado com sucesso!", green);
    setTimeout(() => {
      window.location.replace("./admDashboard.html");
    }, 1000);
  }

  return loginData;
}

export async function checkUserAdm() {
  const checkUser = await fetch(`${baseUrl}/auth/validate_user`, {
    method: "GET",
    headers: requestHeaders,
  }).then((response) => {
    return response.json();
  });
  return checkUser.is_admin;
}

export async function register(data) {
  const registerData = await fetch(`${baseUrl}/auth/register`, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(data),
  }).then((response) => {
    return response.json();
  });

  if (registerData.error) {
    toast(registerData.error, red);
  } else {
    toast(
      "Cadastro realizado com sucesso! Redirecionando para a página de login",
      green
    );
    setTimeout(() => {
      window.location.replace("./login.html");
    }, 2000);
  }

  return registerData;
}

export async function userInformations() {
  const userInformations = await fetch(`${baseUrl}/users/profile`, {
    method: "GET",
    headers: requestHeaders,
  }).then((response) => {
    return response.json();
  });

  return userInformations;
}

export async function userUpdateUserInformation(data) {
  const newUserInformation = await fetch(`${baseUrl}/users`, {
    method: "PATCH",
    headers: requestHeaders,
    body: JSON.stringify(data),
  }).then((response) => {
    return response.json();
  });

  if (newUserInformation.error) {
    toast(newUserInformation.error, red);
  } else {
    toast("Informações atualizadas com sucesso!", green);
    setTimeout(() => {
      window.location.replace("./userDashboard.html");
    }, 1000);
  }

  return newUserInformation;
}

export async function readAllDepartments() {
  const departments = await fetch(`${baseUrl}/departments`, {
    method: "GET",
    headers: requestHeaders,
  }).then((response) => {
    return response.json();
  });

  return departments;
}

export async function readDepartmentByCompany(companyID) {
  const departmentByCompany = await fetch(
    `${baseUrl}/departments/${companyID}`,
    {
      method: "GET",
      headers: requestHeaders,
    }
  ).then((response) => {
    return response.json();
  });

  return departmentByCompany;
}

export async function readAllusers() {
  const users = await fetch(`${baseUrl}/users`, {
    method: "GET",
    headers: requestHeaders,
  }).then((response) => {
    return response.json();
  });

  return users;
}

export async function readUsersOutOfWork() {
  const usersOutOfWork = await fetch(`${baseUrl}/admin/out_of_work`, {
    method: "GET",
    headers: requestHeaders,
  }).then((response) => {
    return response.json();
  });

  return usersOutOfWork;
}

export async function hireUser(data) {
  const hireUser = await fetch(`${baseUrl}/departments/hire`, {
    method: "PATCH",
    headers: requestHeaders,
    body: JSON.stringify(data),
  }).then((response) => {
    return response.json();
  });

  if (hireUser.error) {
    toast(hireUser.error, red);
  } else {
    toast("Usuário contratado!", green);
  }

  return hireUser;
}

export async function dismissUser(data) {
  const dismissUser = await fetch(`${baseUrl}/departments/dismiss/${data}`, {
    method: "PATCH",
    headers: requestHeaders,
  }).then((response) => {
    return response.json();
  });

  if (dismissUser.error) {
    toast(dismissUser.error, red);
  } else {
    toast("Usuário removido do departamento", green);
  }

  return dismissUser;
}

export async function editDepartment(data, departmentID) {
  const editDepartment = await fetch(`${baseUrl}/departments/${departmentID}`, {
    method: "PATCH",
    headers: requestHeaders,
    body: JSON.stringify(data),
  }).then((response) => {
    return response.json();
  });

  if (editDepartment.error) {
    toast(editDepartment.error, red);
  } else {
    toast("Descrição alterada com sucesso!", green);
    window.location.replace("./admDashboard.html");
  }
  return editDepartment;
}

export async function removeDepartment(departmentID) {
  const removeDepartment = await fetch(
    `${baseUrl}/departments/${departmentID}`,
    {
      method: "DELETE",
      headers: requestHeaders,
    }
  );
  if (removeDepartment.error) {
    toast(removeDepartment.error, red);
  } else {
    toast("Departamento removido", green);
    window.location.replace("./admDashboard.html");
  }
}

export async function createNewDepartment(data) {
  const newDepartment = await fetch(`${baseUrl}/departments`, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(data),
  }).then((response) => {
    return response.json();
  });

  if (newDepartment.error) {
    toast(newDepartment.error, red);
  } else {
    toast("Descrição alterada com sucesso!", green);
    window.location.replace("./admDashboard.html");
  }
  return newDepartment;
}

export async function editUser(data, userID) {
  const newUserInfo = await fetch(`${baseUrl}/admin/update_user/${userID}`, {
    method: "PATCH",
    headers: requestHeaders,
    body: JSON.stringify(data),
  }).then((response) => {
    return response.json();
  });

  if (newUserInfo.error) {
    toast(newUserInfo.error, red);
  } else {
    toast("Descrição alterada com sucesso!", green);
    window.location.replace("./admDashboard.html");
  }
  return newUserInfo;
}

export async function removeUser(userID) {
  const removeUser = await fetch(`${baseUrl}/admin/delete_user/${userID}`, {
    method: "DELETE",
    headers: requestHeaders,
  });
  if (removeUser.error) {
    toast(removeUser.error, red);
  } else {
    toast("Departamento removido", green);
    window.location.replace("./admDashboard.html");
  }
}
