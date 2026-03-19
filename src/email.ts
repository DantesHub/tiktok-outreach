import { google } from "googleapis";

function createGmailClient(clientId: string, clientSecret: string, refreshToken: string) {
  const auth = new google.auth.OAuth2(
    clientId,
    clientSecret,
    "https://developers.google.com/oauthplayground"
  );
  auth.setCredentials({ refresh_token: refreshToken });
  return google.gmail({ version: "v1", auth });
}

const accounts = [
  {
    user: process.env.GMAIL_USER!,
    gmail: createGmailClient(
      process.env.GMAIL_CLIENT_ID!,
      process.env.GMAIL_CLIENT_SECRET!,
      process.env.GMAIL_REFRESH_TOKEN!
    ),
  },
  ...(process.env.GMAIL_USER_2
    ? [{
        user: process.env.GMAIL_USER_2,
        gmail: createGmailClient(
          process.env.GMAIL_CLIENT_ID_2!,
          process.env.GMAIL_CLIENT_SECRET_2!,
          process.env.GMAIL_REFRESH_TOKEN_2!
        ),
      }]
    : []),
];

export async function sendEmail(to: string, subject: string, body: string, html: string) {
  const account = accounts[Math.floor(Math.random() * accounts.length)];
  const from = account.user;
  const gmail = account.gmail;
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
