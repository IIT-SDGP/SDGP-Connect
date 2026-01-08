// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
export function rejectedTemplate({
  group_num,
  title,
  reason,
}: {
  group_num: string;
  title: string;
  reason: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8f9fa;
      line-height: 1.6;
      color: #333;
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
      color: #dc3545;
    }
    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    }
    .header {
      background-color: #1a1a1a;
      padding: 30px 20px;
      text-align: center;
    }
    .content {
      padding: 30px 40px;
    }
    h2 {
      color: #333;
      margin-top: 0;
      margin-bottom: 25px;
      font-size: 24px;
      font-weight: 600;
    }
    p {
      margin-bottom: 20px;
      font-size: 17px;
      color: #555;
    }
    .rejected {
      color: #dc3545;
      font-weight: bold;
      font-size: 20px;
    }
    .reason-section {
      margin-top: 30px;
      padding: 20px;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 5px;
      color: #721c24;
      font-size: 16px;
    }
    .reason-section strong {
      color: #721c24;
    }
    .footer {
      background-color: #e9ecef;
      padding: 25px 40px;
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
  </style>
</head>
<body>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-container">
          <tr>
            <td class="header">
              <img src="https://i.ibb.co/v4kSFFCG/iconw.png" alt="SDGP Logo" width="120" />
            </td>
          </tr>
          <tr>
            <td class="content">
              <h2>Hello Team ${group_num},</h2>
              <p>
                Regarding your project titled "<strong style="color: #333;">${title}</strong>", we regret to inform you that it has been
                <span class="rejected">REJECTED</span> at SDGP.LK.
              </p>
              <div class="reason-section">
                <strong>Reason for Rejection:</strong>
                <p style="margin-top: 10px; margin-bottom: 0; color: #721c24;">${reason}</p>
              </div>
              <p style="margin-top: 30px;">
                We understand this may be disappointing. We encourage you to review the feedback provided and consider submitting the project again after making the necessary improvements.
              </p>
              <p>
                We appreciate your effort and look forward to seeing your revised submission in the future.
              </p>
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p>
                If you have any questions or encounter any issues, please contact
                <a href="https://wa.me/+94766867362">Agzaiyenth</a> or
                <a href="https://wa.me/+94774738649">Zion</a>.
              </p>
              <p>&copy; 2025 - Informatics Institute of Technology - All Rights Reserved</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
