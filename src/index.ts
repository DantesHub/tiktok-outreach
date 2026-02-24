import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { extractFromScreenshot } from "./extract.ts";
import { renderEmail } from "./template.ts";
import { sendEmail } from "./email.ts";

const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok" }));

app.use("/outreach", bearerAuth({ token: process.env.API_AUTH_TOKEN! }));

app.post("/outreach", async (c) => {
  try {
    const body_json = await c.req.json<{ image: string }>();
    const image = body_json?.image;
    console.log(`Received request. Has image: ${!!image}, length: ${image?.length ?? 0}`);

    if (!image) return c.json({ error: "Missing 'image' field (base64)" }, 400);

    console.log("Calling GPT-4o-mini...");
    const { firstName, email } = await extractFromScreenshot(image);
    console.log(`Extracted: ${firstName} <${email}>`);

    const { subject, body } = renderEmail(firstName);
    console.log("Sending email...");
    await sendEmail(email, subject, body);
    console.log("Email sent!");

    return c.json({ success: true, firstName, email });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Outreach error:", message);
    return c.json({ error: message }, 500);
  }
});

const port = parseInt(process.env.PORT || "3000");

export default {
  port,
  fetch: app.fetch,
};

console.log(`Server running on port ${port}`);
