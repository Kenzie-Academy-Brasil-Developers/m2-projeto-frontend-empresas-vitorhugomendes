import {
  readAllCompanies,
  readAllCompaniesSectors,
  readCompaniesBySector,
} from "./requests.js";

function renderCompaniesList(companies) {
  const companiesList = document.querySelector(".company__list");

  companiesList.innerHTML = "";

  companies.forEach((company) => {
    const companyCard = createCompanyCard(company);

    companiesList.appendChild(companyCard);
  });
}

function createCompanyCard({ name, opening_hours, sectors }) {
  const companyCard = document.createElement("li");
  const companyName = document.createElement("h2");
  const companyOpeningHours = document.createElement("p");
  const companySector = document.createElement("span");

  companyCard.classList = "company__card";

  companyName.innerText = name;
  companyOpeningHours.innerText = opening_hours;
  companySector.innerText = sectors.description;

  companyCard.append(companyName, companyOpeningHours, companySector);

  return companyCard;
}

function renderSelectOptions(sectors) {
  const select = document.querySelector("#sector");

  sectors.forEach((sector) => {
    select.insertAdjacentHTML(
      "beforeend",
      `<option value=${sector.description}>${sector.description}</option>`
    );
  });
}

function renderSelectedCompanys() {
  const select = document.querySelector("#sector");

  select.addEventListener("change", async (e) => {
    renderCompaniesList(await readCompaniesBySector(select.value));
  });
}

renderCompaniesList(await readAllCompanies());
renderSelectOptions(await readAllCompaniesSectors());
renderSelectedCompanys();
