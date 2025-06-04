import { exec } from "node:child_process";

const run = (cmd) =>
  new Promise((resolve, reject) =>
    exec(cmd, (error, stdout) => {
      if (error) reject(error);
      else resolve(stdout);
    }),
  );

const format = await run("npm run format");
const lint = await run("npm run lint");
const ci = await run("npm run ci");

console.log({ format, lint, ci });

const changeset = await run("git diff --cached --name-only --diff-filter=ACMR");
const modifiedFiles = changeset.split("\n").filter(Boolean);

// check if there are any model files staged
const modifledPartials = modifiedFiles.filter((file) =>
  file.match(/(^|\/)_.*.json/),
);
console.log({ modifledPartials });
if (modifledPartials.length > 0) {
  const output = await run("npm run build:json");
  console.log(output);
  await run(
    "git add component-models.json component-definition.json component-filters.json",
  );
}
