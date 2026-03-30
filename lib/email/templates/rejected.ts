// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function rejectedTemplate({
  group_num,
  title,
  reason,
}: {
  group_num: string;
  title: string;
  reason: string;
}) {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.APP_URL ??
    "https://sdgp.lk"
  ).replace(/\/+$/, "");
  const logoUrl = `${baseUrl}/iconw.png`;
  const currentYear = new Date().getFullYear();
  const copyrightYear =
    currentYear <= 2025 ? "2025" : `2025–${currentYear}`;

  const safeGroupNum = escapeHtml(group_num);
  const safeTitle = escapeHtml(title);
  const safeReasonHtml = escapeHtml(reason).replace(/\r?\n/g, "<br />");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f6f8;
      line-height: 1.65;
      color: #111827;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    td {
      padding: 0;
    }
    img {
      border: 0;
      max-width: 100%;
      height: auto;
      display: block;
      margin: 0 auto;
    }
    a {
      text-decoration: none;
      color: #2563eb;
    }
    .email-container {
      max-width: 600px;
      margin: 28px auto;
      background-color: #ffffff;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid #e7eaee;
      box-shadow: 0 10px 30px rgba(17, 24, 39, 0.08);
    }
    .header {
      background-color: #0b1220;
      background-image: linear-gradient(#0b1220, #0b1220);
      padding: 26px 20px;
      text-align: center;
    }
    .logo {
      width: 140px;
      max-width: 140px;
      height: auto;
    }
    .content {
      padding: 32px 40px 10px 40px;
    }
    h2 {
      color: #111827;
      margin-top: 0;
      margin-bottom: 25px;
      font-size: 24px;
      font-weight: 600;
    }
    p {
      margin-bottom: 20px;
      font-size: 17px;
      color: #374151;
    }
    .subtitle {
      margin-top: -12px;
      margin-bottom: 18px;
      font-size: 14px;
      color: #6b7280;
    }
    .badge {
      display: inline-block;
      padding: 6px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.06em;
      background: #fde8ea;
      color: #8a1a1a;
      border: 1px solid #f8b4b4;
    }
    .highlight {
      color: #111827;
      font-weight: 700;
    }
    .rejected {
      color: #dc3545;
      font-weight: bold;
      font-size: 20px;
    }
    .reason-section {
      margin-top: 30px;
      padding: 18px;
      background-color: #fff1f2;
      border: 1px solid #fecdd3;
      border-radius: 10px;
      color: #721c24;
      font-size: 16px;
    }
    .reason-section strong {
      color: #721c24;
    }
    .button-container {
      text-align: center;
      margin: 26px 0 34px 0;
    }
    .button {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff !important;
      padding: 14px 30px;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 700;
      border: 1px solid #1d4ed8;
      text-decoration: none;
    }
    .footer {
      background-color: #f3f4f6;
      padding: 22px 34px;
      text-align: center;
      font-size: 12px;
      color: #6c757d;
      border-top: 1px solid #dee2e6;
    }
    .footer p {
      margin: 0 0 10px 0;
      font-size: 12px;
      color: #6c757d;
    }
    .footer a {
      color: #333333;
      text-decoration: none;
      font-weight: bold;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    @media (prefers-color-scheme: dark) {
      body { background-color: #0b1220 !important; color: #e5e7eb !important; }
      .email-container { background-color: #0f172a !important; border-color: #1f2937 !important; box-shadow: none !important; }
      .content { background-color: #0f172a !important; }
      h2 { color: #f9fafb !important; }
      p { color: #d1d5db !important; }
      .subtitle { color: #9ca3af !important; }
      .highlight { color: #f9fafb !important; }
      a { color: #60a5fa !important; }
      .badge { background: #3f0d12 !important; color: #fecaca !important; border-color: #7f1d1d !important; }
      .reason-section { background-color: #2a0f13 !important; border-color: #7f1d1d !important; color: #fecaca !important; }
      .reason-section strong { color: #fecaca !important; }
      .footer { background-color: #0b1220 !important; border-top-color: #1f2937 !important; color: #9ca3af !important; }
      .footer p { color: #9ca3af !important; }
      .footer a { color: #e5e7eb !important; }
    }
    @media (max-width: 640px) {
      .content { padding: 26px 22px 8px 22px; }
      .footer { padding: 18px 18px; }
    }
  </style>
</head>
<body>
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">
    Your SDGP project "${safeTitle}" was not approved. See the reason inside.
  </div>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" bgcolor="#f4f6f8" style="background-color:#f4f6f8;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-container">
          <tr>
            <td class="header" bgcolor="#0b1220" style="background:#0b1220;background-color:#0b1220;background-image:linear-gradient(#0b1220,#0b1220);padding:26px 20px;text-align:center;">
              <img src="${logoUrl}" alt="SDGP.LK" width="140" class="logo" />
            </td>
          </tr>
          <tr>
            <td class="content">
              <div class="badge">REJECTED</div>
              <h2 style="margin-top: 14px;">Hello Team ${safeGroupNum},</h2>
              <p class="subtitle">SDGP Project Decision</p>
              <p>
                Regarding your project titled "<strong class="highlight">${safeTitle}</strong>", we regret to inform you that it has been rejected at <strong class="highlight">SDGP.LK</strong>.
              </p>
              <div class="reason-section">
                <strong>Reason for Rejection:</strong>
                <p style="margin-top: 10px; margin-bottom: 0; color: inherit;">${safeReasonHtml}</p>
              </div>
              <p style="margin-top: 30px;">
                We understand this may be disappointing. We encourage you to review the feedback provided and consider submitting the project again after making the necessary improvements.
              </p>
              <p>
                We appreciate your effort and look forward to seeing your revised submission in the future.
              </p>
              <div class="button-container">
                <a
                  href="${baseUrl}"
                  class="button"
                  style="display:inline-block;background-color:#2563eb;color:#ffffff !important;padding:14px 30px;border-radius:10px;font-size:16px;font-weight:700;line-height:1.2;border:1px solid #1d4ed8;text-decoration:none;"
                >Open SDGP.LK</a>
              </div>
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p>
                If you have any questions or encounter any issues, please contact
                <a href="https://wa.me/+94766867362">Agzaiyenth</a>.
              </p>
              <p>&copy; ${copyrightYear} Informatics Institute of Technology. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
