// Checks the translation catalogs in src/i18n/messages:
// - every locale has the same feature files and the same keys as English
// - no message is empty
// - numbers never use the locale's default digits: `#` in plurals, a bare
//   `{n, number}` or a number skeleton would render Arabic-Indic digits on
//   some runtimes, so counts must use a named format (`{n, number, integer}`)
//   that pins numberingSystem to latn (see src/i18n/formats.ts).
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../src/i18n/messages/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const source = "en";
const locales = readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
const allowedNumberStyles = new Set(["integer", "plain", "decimal", "compact", "percent"]);
const problems = [];

function flatten(obj, prefix = "") {
  return Object.entries(obj).flatMap(([key, value]) =>
    typeof value === "object" && value !== null ? flatten(value, `${prefix}${key}.`) : [[`${prefix}${key}`, value]],
  );
}

function load(locale) {
  const files = readdirSync(join(root, locale)).filter((f) => f.endsWith(".json"));
  return Object.fromEntries(files.map((f) => [f, new Map(flatten(JSON.parse(readFileSync(join(root, locale, f), "utf8"))))]));
}

const catalogs = Object.fromEntries(locales.map((l) => [l, load(l)]));

for (const locale of locales) {
  for (const [file, entries] of Object.entries(catalogs[locale])) {
    for (const [key, value] of entries) {
      const where = `${locale}/${file} ${key}`;
      if (typeof value !== "string" || value.trim() === "") problems.push(`${where}: empty or non-string message`);
      if (typeof value !== "string") continue;
      // Outside a plural, `#` is just a literal character (e.g. "Amendment #3").
      if (/,\s*(plural|selectordinal)\s*,/.test(value) && value.includes("#")) {
        problems.push(`${where}: uses '#' in a plural; use {n, number, integer} instead`);
      }
      for (const match of value.matchAll(/\{\s*(\w+)\s*,\s*number\s*(?:,\s*([^}]*?)\s*)?\}/g)) {
        if (!match[2] || !allowedNumberStyles.has(match[2])) {
          problems.push(`${where}: {${match[1]}, number${match[2] ? `, ${match[2]}` : ""}} must use a named format (${[...allowedNumberStyles].join(", ")})`);
        }
      }
    }
  }
  if (locale === source) continue;
  for (const [file, entries] of Object.entries(catalogs[source])) {
    const other = catalogs[locale][file];
    if (!other) { problems.push(`${locale}/${file}: missing file`); continue; }
    for (const key of entries.keys()) if (!other.has(key)) problems.push(`${locale}/${file} ${key}: missing (present in ${source})`);
    for (const key of other.keys()) if (!entries.has(key)) problems.push(`${locale}/${file} ${key}: not in ${source}`);
  }
  for (const file of Object.keys(catalogs[locale])) {
    if (!catalogs[source][file]) problems.push(`${locale}/${file}: no ${source} counterpart`);
  }
}

if (problems.length) {
  console.error(`i18n check failed (${problems.length}):\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
const counts = locales.map((l) => `${l}: ${Object.values(catalogs[l]).reduce((n, m) => n + m.size, 0)} messages`);
console.log(`i18n check passed (${counts.join(", ")})`);
