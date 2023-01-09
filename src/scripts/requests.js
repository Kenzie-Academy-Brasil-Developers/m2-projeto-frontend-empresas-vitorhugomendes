const { token } = "";
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
