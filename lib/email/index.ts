// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import nodemailer from "nodemailer";
import { emailConfig } from "./config";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const transporter = nodemailer.createTransport(emailConfig);
  await transporter.sendMail({
    from: emailConfig.auth.user,
    to,
    subject,
    html,
  });
}
