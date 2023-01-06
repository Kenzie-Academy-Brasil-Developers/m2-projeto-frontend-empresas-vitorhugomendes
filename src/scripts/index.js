import {
  readAllCompanies,
  readAllCompaniesSectors,
  readCompaniesBySector,
} from "./requests.js";

console.log(await readAllCompanies());

console.log(await readAllCompaniesSectors());

console.log(await readCompaniesBySector("Varejo"));
