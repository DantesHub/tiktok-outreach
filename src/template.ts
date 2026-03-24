export function renderEmail(firstName: string): { subject: string; body: string; html: string } {
  const appUrl = "https://apps.apple.com/gb/app/lumo-daily-light/id6757131632";
  const tiktokUrl = "https://www.tiktok.com/@saad.sochill";
  const creatorUrl = "https://www.tiktok.com/@maryam.prays6";

  return {
    subject: `${firstName} x Lumo | Paid Promo?`,
    body: `Hey ${firstName},

I love your content and would love to do UGC-content with you.

It's for my app Lumo - it's like "Finch for Muslims" - keep up with daily spiritual goals with friends.

You don't need to be Muslim to do this!

Here's how UGC would work:
1. $20 sign up bonus
2. I'll provide an example TikTok which you literally make a 1-1 copy off
3. You get paid weekly for your videos based on performance!

One of my creators has already made $400 in 2 weeks:
${creatorUrl}

I'd love to have you on - happy to jump on a call to discuss!

Thanks,
Saad

p.s. I post about the app on my TikTok - check it out!
${tiktokUrl}

app store link:
${appUrl}`,
    html: `<p>Hey ${firstName},</p>
<p>I love your content and would love to do UGC-content with you.</p>
<p>It's for my app Lumo - it's like "Finch for Muslims" - keep up with daily spiritual goals with friends.</p>
<p><b>You don\u2019t need to be Muslim to do this!</b></p>
<p>Here\u2019s how UGC would work:</p>
<ol>
<li>$20 sign up bonus</li>
<li>I'll provide an example TikTok which you literally make a 1-1 copy off</li>
<li>You get paid weekly for your videos based on performance!</li>
</ol>
<p>One of my creators has already made $400 in 2 weeks:<br><a href="${creatorUrl}">${creatorUrl}</a></p>
<p>I'd love to have you on - happy to jump on a call to discuss!</p>
<p>Thanks,<br>Saad</p>
<p>p.s. I post about the app on my TikTok - check it out!<br><a href="${tiktokUrl}">${tiktokUrl}</a></p>
<p>app store link:<br><a href="${appUrl}">${appUrl}</a></p>`,
  };
}
