// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { Queue } from "bullmq";
import { prisma } from "../../prisma/prismaClient";
import { EmailOutboxStatus, Prisma } from "@prisma/client";
import { getRedisConnection } from "../queue/redis";
import { sendEmail } from "./index";

export const EMAIL_OUTBOX_QUEUE = "email-outbox";

type QueueEmailInput = {
  type: string;
  to: string;
  subject: string;
  html: string;
  meta?: Prisma.InputJsonValue;
};

function truncateError(value: unknown, maxLen = 900) {
  const text =
    value instanceof Error
      ? `${value.name}: ${value.message}`
      : typeof value === "string"
        ? value
        : JSON.stringify(value);

  if (!text) return "Unknown error";
  return text.length > maxLen ? `${text.slice(0, maxLen - 1)}…` : text;
}

function computeBackoffMs(attempts: number) {
  // 30s, 60s, 2m, 4m, 8m, 15m, 15m...
  const base = 30_000;
  const max = 15 * 60_000;
  const ms = base * Math.pow(2, Math.max(0, attempts - 1));
  return Math.min(ms, max);
}

function getQueue() {
  const connection = getRedisConnection();
  if (!connection) return null;

  return new Queue(EMAIL_OUTBOX_QUEUE, { connection });
}

export async function enqueueEmail(input: QueueEmailInput) {
  const now = new Date();
  const outbox = await prisma.emailOutbox.create({
    data: {
      type: input.type,
      to: input.to,
      subject: input.subject,
      html: input.html,
      status: EmailOutboxStatus.PENDING,
      attempts: 0,
      nextAttemptAt: now,
      meta: input.meta ?? undefined,
    },
  });

  const queue = getQueue();
  if (queue) {
    await queue.add(
      "send",
      { outboxId: outbox.id },
      { removeOnComplete: 2000, removeOnFail: 5000 }
    );
    return outbox;
  }

  // Fallback for environments without Redis: try once and persist result.
  try {
    await processOutboxEmail(outbox.id);
  } catch {
    // swallow - status already updated to FAILED
  }

  return outbox;
}

export async function retryOutboxEmail(outboxId: string) {
  const now = new Date();
  await prisma.emailOutbox.update({
    where: { id: outboxId },
    data: {
      status: EmailOutboxStatus.PENDING,
      nextAttemptAt: now,
      lastError: null,
    },
  });

  const queue = getQueue();
  if (queue) {
    await queue.add("send", { outboxId }, { removeOnComplete: 2000, removeOnFail: 5000 });
  } else {
    try {
      await processOutboxEmail(outboxId);
    } catch {
      // swallow
    }
  }
}

export async function processOutboxEmail(outboxId: string) {
  const now = new Date();

  // Mark as sending only if eligible (prevents double-send across workers)
  const updated = await prisma.emailOutbox.updateMany({
    where: {
      id: outboxId,
      status: { in: [EmailOutboxStatus.PENDING, EmailOutboxStatus.FAILED] },
      OR: [{ nextAttemptAt: null }, { nextAttemptAt: { lte: now } }],
    },
    data: {
      status: EmailOutboxStatus.SENDING,
      lastError: null,
    },
  });

  if (updated.count === 0) return;

  const item = await prisma.emailOutbox.findUnique({ where: { id: outboxId } });
  if (!item) return;

  try {
    await sendEmail({ to: item.to, subject: item.subject, html: item.html });
    await prisma.emailOutbox.update({
      where: { id: item.id },
      data: {
        status: EmailOutboxStatus.SENT,
        nextAttemptAt: null,
      },
    });
  } catch (err) {
    const attempts = item.attempts + 1;
    const maxAttempts = 8;
    const willRetry = attempts < maxAttempts;
    const nextAttemptAt = willRetry ? new Date(Date.now() + computeBackoffMs(attempts)) : null;
    const lastError = truncateError(err);

    await prisma.emailOutbox.update({
      where: { id: item.id },
      data: {
        status: EmailOutboxStatus.FAILED,
        attempts,
        lastError,
        nextAttemptAt,
      },
    });

    const queue = getQueue();
    if (queue && nextAttemptAt) {
      const delay = Math.max(0, nextAttemptAt.getTime() - Date.now());
      await queue.add(
        "send",
        { outboxId: item.id },
        { delay, removeOnComplete: 2000, removeOnFail: 5000 }
      );
    }

    throw err;
  }
}
