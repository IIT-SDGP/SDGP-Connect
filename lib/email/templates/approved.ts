// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
export function approvedTemplate({
  group_num,
  title,
  projectId,
}: {
  group_num: string;
  title: string;
  projectId: string;
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
      color: #007bff;
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
    .approved {
      color: #28a745;
      font-weight: bold;
      font-size: 20px;
    }
    .button-container {
      text-align: center;
      margin: 40px 0;
    }
    .button {
      display: inline-block;
      background-color: #1a1a1a;
      color: #ffffff;
      padding: 14px 30px;
      border-radius: 6px;
      font-size: 17px;
      font-weight: bold;
      transition: background-color 0.3s ease;
    }
    .button:hover {
      background-color: #333333;
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
              <p style="font-weight: bold;">
                Your project titled "<strong style="color: #333;">${title}</strong>" has been
                <span class="approved">APPROVED</span> at SDGP.LK!
              </p>
              <p>We're thrilled to inform you that your hard work has paid off.</p>
              <div class="button-container">
                <a href="https://sdgp.lk/project/${projectId}" class="button">View Your Project Here</a>
              </div>
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
