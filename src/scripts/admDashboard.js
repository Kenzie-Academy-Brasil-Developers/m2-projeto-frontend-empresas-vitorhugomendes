import { getUser, checkUserAdm } from "./requests.js";

async function renderAdminDashboard() {
  const user = getUser();
  if (!user) {
    window.location.replace("/");
  } else if (!(await checkUserAdm())) {
    window.location.replace("./userDashboard.html");
  }
}

renderAdminDashboard();
