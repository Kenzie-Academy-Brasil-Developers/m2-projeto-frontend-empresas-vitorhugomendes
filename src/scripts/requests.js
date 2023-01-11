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
