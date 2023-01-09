import { getUser, checkUserAdm } from "./requests.js";

async function renderUserDashboard() {
  const user = getUser();
  if (!user) {
    window.location.replace("/");
  } else if (await checkUserAdm()) {
    window.location.replace("./admDashboard.html");
  }
}

renderUserDashboard();
