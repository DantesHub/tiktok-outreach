import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: "v1", auth: oauth2Client });

export async function sendEmail(to: string, subject: string, body: string, html: string) {
  const from = process.env.GMAIL_USER!;
  const boundary = "boundary_" + Date.now();

  // Build raw RFC 2822 multipart message (plain + HTML)
  const messageParts = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    "",
    body,
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    "",
    html,
    `--${boundary}--`,
  ];
  const rawMessage = messageParts.join("\r\n");

  // Gmail API expects URL-safe base64
  const encodedMessage = Buffer.from(rawMessage)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw: encodedMessage },
  });
}
