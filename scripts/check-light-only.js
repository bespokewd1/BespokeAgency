const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");
const forbiddenPatterns = [
  ["dark-mode stylesheet", /assets\/css\/dark\.css/i],
  ["dark-mode script", /assets\/js\/dark\.js/i],
  ["dark-mode toggle", /dark-mode-toggle/i],
  ["dark system preference detection", /prefers-color-scheme\s*:\s*dark/i],
  ["dark-mode class activation", /classList\.(?:add|toggle)\([^)]*["']dark-mode["']/i],
];

function listHtmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listHtmlFiles(entryPath);
    return entry.name.endsWith(".html") ? [entryPath] : [];
  });
}

const failures = [];
for (const file of listHtmlFiles(publicDir)) {
  const html = fs.readFileSync(file, "utf8");
  for (const [description, pattern] of forbiddenPatterns) {
    if (pattern.test(html)) {
      failures.push(`${path.relative(publicDir, file)}: ${description}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Dark mode is still active in the rendered site:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Light-only check passed: no rendered page can activate dark mode.");
