import auth from "./auth.json";
import common from "./common.json";

// One file per feature keeps translation diffs reviewable. Keep this list in
// the same order as the other locale's index.
const messages = { common, auth };

export default messages;
