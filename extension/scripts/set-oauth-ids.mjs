import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const manifestPath = path.join(rootDir, "public", "manifest.json");
const authPath = path.join(rootDir, "src", "utils", "auth.js");

function parseArg(name) {
  const direct = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  if (direct) return direct.slice(name.length + 3).trim();

  const index = process.argv.findIndex((arg) => arg === `--${name}`);
  if (index >= 0 && process.argv[index + 1]) return process.argv[index + 1].trim();

  return "";
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

const googleClientId = parseArg("google");
const linkedinClientId = parseArg("linkedin");

if (!googleClientId || !linkedinClientId) {
  fail(
    [
      "Missing required args.",
      "Usage:",
      "npm run set:oauth -- --google=<GOOGLE_CLIENT_ID> --linkedin=<LINKEDIN_CLIENT_ID>"
    ].join("\n")
  );
}

if (!fs.existsSync(manifestPath)) {
  fail(`Cannot find manifest at ${manifestPath}`);
}
if (!fs.existsSync(authPath)) {
  fail(`Cannot find auth util at ${authPath}`);
}

const manifestRaw = fs.readFileSync(manifestPath, "utf8");
let manifest;
try {
  manifest = JSON.parse(manifestRaw);
} catch {
  fail("manifest.json is not valid JSON");
}

if (!manifest.oauth2) {
  manifest.oauth2 = { client_id: "", scopes: [] };
}
manifest.oauth2.client_id = googleClientId;

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

const authRaw = fs.readFileSync(authPath, "utf8");
const authUpdated = authRaw.replace(
  /const LINKEDIN_CLIENT_ID = ".*";/,
  `const LINKEDIN_CLIENT_ID = "${linkedinClientId}";`
);

if (authUpdated === authRaw) {
  fail("Could not update LINKEDIN_CLIENT_ID in src/utils/auth.js");
}

fs.writeFileSync(authPath, authUpdated, "utf8");

console.log("Updated OAuth client IDs successfully.");
console.log(`Google client ID set in public/manifest.json`);
console.log(`LinkedIn client ID set in src/utils/auth.js`);
