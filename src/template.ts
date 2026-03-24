export function renderEmail(firstName: string): { subject: string; body: string; html: string } {
  const appUrl = "https://apps.apple.com/gb/app/lumo-daily-light/id6757131632";
  const tiktokUrl = "https://www.tiktok.com/@saad.sochill";

  return {
    subject: `${firstName} x Lumo | Paid Promo?`,
    body: `Hey ${firstName},

I love your content and would love to do UGC-content with you.

It's for my app Lumo - it's like "Finch for Muslims" - keep up with daily spiritual goals with friends.  and you don't need to be Muslim to make UGC-content !!!

Check it out on the app store!
${appUrl}
Basically, I'll provide an example TikTok which you literally make a copy of!

One of my creators has already made $400 in 2 weeks!

If interested, let's hop in a 2 minute call!

Thanks, Saad

p.s. I post about the app on my TikTok - check it out!
${tiktokUrl}`,
    html: `<p>Hey ${firstName},</p>
<p>I love your content and would love to do UGC-content with you.</p>
<p>It's for my app Lumo - it's like "Finch for Muslims" - keep up with daily spiritual goals with friends.  and you don't need to be Muslim to make UGC-content !!!</p>
<p>Check it out on the app store!<br><a href="${appUrl}">${appUrl}</a></p>
<p>Basically, I'll provide an example TikTok which you literally make a copy of!</p>
<p>One of my creators has already made $400 in 2 weeks!</p>
<p>If interested, let's hop in a 2 minute call!</p>
<p>Thanks, Saad</p>
<p>p.s. I post about the app on my TikTok - check it out!<br><a href="${tiktokUrl}">${tiktokUrl}</a></p>`,
  };
}
