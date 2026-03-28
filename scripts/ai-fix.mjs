import fs from "fs";
import { execSync } from "child_process";

const token = process.env.GITHUB_TOKEN;
const issueTitle = process.env.ISSUE_TITLE;
const issueBody = process.env.ISSUE_BODY;
const issueNumber = process.env.ISSUE_NUMBER;

console.log("GitHub Models AI Fixer started");

try {
  const repoTree = execSync("find . -type f | head -n 200").toString();

  const response = await fetch(
    "https://models.github.ai/inference/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are a senior Next.js developer.

Return ONLY valid JSON:
[
  { "file": "path", "content": "full file content" }
]

Rules:
- No explanations
- Only fix required files
- Ensure code compiles
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
        temperature: 0.2,
      }),
    }
  );

  const data = await response.json();

  if (!data.choices || !data.choices[0]) {
    console.error("GitHub Models API error:");
    console.error(JSON.stringify(data, null, 2));
    process.exit(1);
  }

  const text = data.choices[0].message.content;

  let patches;
  try {
    patches = JSON.parse(text);
  } catch (e) {
    console.error("Invalid JSON from AI:");
    console.error(text);
    process.exit(1);
  }

  for (const patch of patches) {
    fs.mkdirSync(patch.file.split("/").slice(0, -1).join("/"), {
      recursive: true,
    });

    fs.writeFileSync(patch.file, patch.content, "utf8");
  }

  const branch = `ai-fix-${issueNumber}`;
  execSync(`git checkout -b ${branch}`);

  try {
    execSync("yarn install --frozen-lockfile", { stdio: "inherit" });
    execSync("yarn build", { stdio: "inherit" });
  } catch (err) {
    console.log("Build failed, skipping PR");
    process.exit(1);
  }

  execSync("git add .");
  execSync(`git commit -m "AI fix for issue #${issueNumber}"`);
  execSync(`git push origin ${branch}`);

  execSync(`
    gh pr create \
      --title "AI Fix: Issue #${issueNumber}" \
      --body "Auto-generated fix using GitHub Models" \
      --head ${branch} \
      --base main
  `);

  console.log("PR created successfully");
} catch (err) {
  console.error("Fatal error:", err);
  process.exit(1);
}