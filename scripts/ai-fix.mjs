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
        "Accept": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
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
- Only valid JSON
- Fix only required files
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

  // SAFE RAW RESPONSE HANDLING (FIXES YOUR ERROR)
  const rawText = await response.text();

  console.log("RAW RESPONSE:");
  console.log(rawText);

  let data;
  try {
    data = JSON.parse(rawText);
  } catch (err) {
    console.error("Failed to parse response JSON");
    console.error(rawText);
    process.exit(1);
  }

  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    console.error("No AI content returned");
    console.error(JSON.stringify(data, null, 2));
    process.exit(1);
  }

  let patches;
  try {
    patches = JSON.parse(content);
  } catch (err) {
    console.error("AI returned invalid JSON:");
    console.error(content);
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