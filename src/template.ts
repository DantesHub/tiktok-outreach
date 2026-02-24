export function renderEmail(firstName: string): { subject: string; body: string } {
  return {
    subject: `Collab opportunity, ${firstName}?`,
    body: `Hey ${firstName},

I came across your content on TikTok and love your style! I think you'd be a great fit for a UGC collaboration we're putting together.

Would you be open to a quick chat about it?

Best,
Saad`,
  };
}
