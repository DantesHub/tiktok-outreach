import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { extractFromScreenshot } from "./extract.ts";
import { renderEmail } from "./template.ts";
import { sendEmail } from "./email.ts";

const app = new Hono();
const apiAuthToken = process.env.API_AUTH_TOKEN;

app.get("/health", (c) => c.json({ status: "ok" }));

if (apiAuthToken) {
  app.use("/outreach", bearerAuth({ token: apiAuthToken }));
} else {
  app.use("/outreach", async (c) => {
    return c.json(
      { error: "Server is missing API_AUTH_TOKEN. Set it in your environment variables." },
      503
    );
  });
}

app.post("/outreach", async (c) => {
  try {
    const body_json = await c.req.json<{ image: string }>();
    const image = body_json?.image;
    console.log(`Received request. Has image: ${!!image}, length: ${image?.length ?? 0}`);

    if (!image) return c.json({ error: "Missing 'image' field (base64)" }, 400);

    console.log("Extracting creator info from screenshot...");
    const { firstName, email } = await extractFromScreenshot(image);
    console.log(`Extracted: ${firstName} <${email}>`);

    const { subject, body, html } = renderEmail(firstName);
    console.log("Sending email...");
    try {
      await sendEmail(email, subject, body, html);
      console.log("Email sent!");
    } catch (emailErr) {
      console.error("Email error:", emailErr);
      throw emailErr;
    }

    return c.json({ success: true, firstName, email });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Outreach error:", message);
    return c.json({ error: message }, 500);
  }
});

const requestedPort = Number.parseInt(process.env.PORT ?? "3000", 10);
const port = Number.isFinite(requestedPort) && requestedPort > 0 ? requestedPort : 3000;

const server = Bun.serve({
  hostname: "0.0.0.0",
  port,
  fetch: app.fetch,
});

console.log(`Server running on ${server.url}`);
