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
    const { image } = await c.req.json<{ image: string }>();
    if (!image) return c.json({ error: "Missing 'image' field (base64)" }, 400);

    const { firstName, email } = await extractFromScreenshot(image);
    const { subject, body } = renderEmail(firstName);
    await sendEmail(email, subject, body);

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
