import auth from "./auth.json";
import common from "./common.json";
import layout from "./layout.json";
import notifications from "./notifications.json";
import activity from "./activity.json";
import chat from "./chat.json";
import dashboard from "./dashboard.json";
import status from "./status.json";
import projects from "./projects.json";
import clients from "./clients.json";
import profile from "./profile.json";
import clientProjects from "./clientProjects.json";
import contracts from "./contracts.json";
import clientContracts from "./clientContracts.json";

// One file per feature keeps translation diffs reviewable. Keep this list in
// the same order as the other locale's index.
const messages = { auth, common, layout, notifications, activity, chat, dashboard, status, projects, clients, profile, clientProjects, contracts, clientContracts };

export default messages;
