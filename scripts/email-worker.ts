// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { Worker } from "bullmq";
import { EMAIL_OUTBOX_QUEUE, processOutboxEmail } from "../lib/email/outbox";
import { getRedisConnection } from "../lib/queue/redis";

const connection = getRedisConnection();
if (!connection) {
  console.error("Missing REDIS_URL. Email worker cannot start.");
  process.exit(1);
}

const concurrency = Number(process.env.EMAIL_WORKER_CONCURRENCY || 5);

const worker = new Worker(
  EMAIL_OUTBOX_QUEUE,
  async (job) => {
    const outboxId = job.data?.outboxId as string | undefined;
    if (!outboxId) return;
    await processOutboxEmail(outboxId);
  },
  { connection, concurrency }
);

worker.on("failed", (job, err) => {
  console.error("Email job failed:", job?.id, err?.message || err);
});

worker.on("completed", (job) => {
  if (process.env.EMAIL_WORKER_LOG_SUCCESS === "true") {
    console.log("Email job completed:", job.id);
  }
});

console.log(`Email worker running. queue=${EMAIL_OUTBOX_QUEUE} concurrency=${concurrency}`);
