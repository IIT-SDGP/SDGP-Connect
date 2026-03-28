import fs from "fs";
import { execSync } from "child_process";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const issueTitle = process.env.ISSUE_TITLE;
const issueBody = process.env.ISSUE_BODY;
const issueNumber = process.env.ISSUE_NUMBER;

console.log("Psycode BOT Fixer started");

// 1. Get lightweight repo structure
const repoTree = execSync("find . -type f | head -n 200").toString();

const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  },
  body: JSON.stringify({
    model: "gpt-5-mini",
    messages: [
      {
        role: "system",
        content: `
You are a senior Next.js + React engineer.

Return ONLY valid JSON:
[
  { "file": "path", "content": "full file content" }
]

Rules:
- No explanations
- Ensure code compiles
- Only fix what's needed
        `,
      },
      {
        role: "user",
        content: `
Issue Title: ${issueTitle}

Issue Body:
${issueBody}

Repo Files:
${repoTree}
        `,
      },
    ],
  }),
});

const data = await response.json();
const text = data.choices[0].message.content;

console.log("AI Response received");

// 3. Parse AI response safely
let patches;
try {
  patches = JSON.parse(text);
} catch (e) {
  console.error("Invalid JSON from AI");
  process.exit(1);
}

// 4. Apply patches
for (const patch of patches) {
  fs.mkdirSync(patch.file.split("/").slice(0, -1).join("/"), {
    recursive: true,
  });

  fs.writeFileSync(patch.file, patch.content, "utf8");
}

// 5. Create branch
const branch = `ai-fix-${issueNumber}`;
execSync(`git checkout -b ${branch}`);

// 6. Yarn install + build
try {
  execSync("yarn install --frozen-lockfile", { stdio: "inherit" });
  execSync("yarn build", { stdio: "inherit" });
} catch (err) {
  console.log("Build failed, skipping PR");
  process.exit(1);
}

// 7. Commit changes
execSync("git add .");
execSync(`git commit -m "AI fix for issue #${issueNumber}"`);

// 8. Push branch
execSync(`git push origin ${branch}`);

// 9. Create PR
execSync(`
  gh pr create \
    --title "AI Fix: Issue #${issueNumber}" \
    --body "Auto-generated fix triggered by label ai-will-fix" \
    --head ${branch} \
    --base main
`);

console.log("PR created successfully");
