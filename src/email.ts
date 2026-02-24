import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendEmail(to: string, subject: string, body: string) {
  await transport.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    text: body,
  });
}
