export function renderEmail(firstName: string): { subject: string; body: string; html: string } {
  const appUrl = "https://apps.apple.com/gb/app/lumo-daily-light/id6757131632";

  return {
    subject: `${firstName} x Lumo | Paid Promo?`,
    body: `Hey ${firstName},

I love your content and would love to do a promotion with you !!

Our app is "Finch for Muslims" - keep up with daily Islamic goals with friends!

It's called "Lumo Daily Light" if you want to check it out on the app store:

${appUrl}

If interested, let's hop in a 2 minute call!

Thanks,
Saad`,
    html: `<p>Salaams ${firstName},</p>
<p>I love your content and would love to do a promotion with you !!</p>
<p>Our app is "Finch for Muslims" - keep up with daily Islamic goals with friends!</p>
<p>It's called "Lumo Daily Light" if you want to check it out on the app store:</p>
<p><a href="${appUrl}">${appUrl}</a></p>
<p>If interested, let's hop in a 2 minute call!</p>
<p>Thanks,<br>Saad</p>`,
  };
}
