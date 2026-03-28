// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import IORedis from "ioredis";

export function getRedisConnection() {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  return new IORedis(url, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
}

