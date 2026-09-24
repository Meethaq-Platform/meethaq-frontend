import auth from "./auth.json";
import common from "./common.json";
import layout from "./layout.json";
import notifications from "./notifications.json";

// One file per feature keeps translation diffs reviewable. Keep this list in
// the same order as the other locale's index.
const messages = { auth, common, layout, notifications };

export default messages;
