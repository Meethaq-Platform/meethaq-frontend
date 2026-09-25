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
import milestones from "./milestones.json";
import submissions from "./submissions.json";
import clientSubmissions from "./clientSubmissions.json";
import changeRequests from "./changeRequests.json";
import disputes from "./disputes.json";
import payments from "./payments.json";
import pageTitles from "./pageTitles.json";
import events from "./events.json";
import apiMessages from "./apiMessages.json";
import landing from "./landing.json";

// One file per feature keeps translation diffs reviewable. Keep this list in
// the same order as the other locale's index.
const messages = { auth, common, layout, notifications, activity, chat, dashboard, status, projects, clients, profile, clientProjects, contracts, clientContracts, milestones, submissions, clientSubmissions, changeRequests, disputes, payments, pageTitles, events, apiMessages, landing };

export default messages;
