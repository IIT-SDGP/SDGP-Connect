import fs from "fs";
import { execSync } from "child_process";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const issueTitle = process.env.ISSUE_TITLE;
const issueBody = process.env.ISSUE_BODY;
const issueNumber = process.env.ISSUE_NUMBER;

console.log("AI Fixer started");

try {
  const repoTree = execSync("find . -type f | head -n 200").toString();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
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
- Only fix required files
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

  // SAFE CHECK (FIXES YOUR ERROR)
  if (!data.choices || !data.choices[0]) {
    console.error("OpenAI API Error:");
    console.error(JSON.stringify(data, null, 2));
    process.exit(1);
  }

  const text = data.choices[0].message.content;

  let patches;
  try {
    patches = JSON.parse(text);
  } catch (err) {
    console.error("Invalid JSON from AI");
    console.error(text);
    process.exit(1);
  }

  // Apply file changes
  for (const patch of patches) {
    fs.mkdirSync(patch.file.split("/").slice(0, -1).join("/"), {
      recursive: true,
    });

    fs.writeFileSync(patch.file, patch.content, "utf8");
  }

  const branch = `ai-fix-${issueNumber}`;
  execSync(`git checkout -b ${branch}`);

  // Yarn build check
  try {
    execSync("yarn install --frozen-lockfile", { stdio: "inherit" });
    execSync("yarn build", { stdio: "inherit" });
  } catch (err) {
    console.log("Build failed — skipping PR");
    process.exit(1);
  }

  execSync("git add .");
  execSync(`git commit -m "AI fix for issue #${issueNumber}"`);
  execSync(`git push origin ${branch}`);

  execSync(`
    gh pr create \
      --title "AI Fix: Issue #${issueNumber}" \
      --body "Auto-generated fix triggered by label ai-will-fix" \
      --head ${branch} \
      --base main
  `);

  console.log("PR created successfully");
} catch (err) {
  console.error("Fatal error:", err);
  process.exit(1);
}