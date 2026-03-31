import nodemailer from "nodemailer";

const from = process.env.GMAIL_USER;
const appPassword = process.env.GMAIL_APP_PASSWORD;

export async function sendEmail(to: string, subject: string, body: string, html: string) {
  if (!from || !appPassword) {
    throw new Error("Missing GMAIL_USER or GMAIL_APP_PASSWORD");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: from,
      pass: appPassword,
    },
  });

  await transporter.sendMail({
    from,
    to,
    subject,
    text: body,
    html,
  });
}
