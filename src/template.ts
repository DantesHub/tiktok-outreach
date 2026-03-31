export function renderEmail(firstName: string): { subject: string; body: string; html: string } {
  const appUrl = "https://apps.apple.com/us/app/focus-town-study-with-friends/id6758457625";
  const loomUrl = "https://www.loom.com/share/db0013e0c1ad4128b23a948d2d8c3166";

  return {
    subject: `${firstName} x Animal Crossing StudywithME collab`,
    body: `Hey!

I recently came across one of your videos on my foryou page and ended up checking out your account. I really loved your overall aesthetic, the fonts, music, and sound design all feel super intentional.

My name is Dante, and I recently launched Focustown, a cozy focus timer inspired by Animal Crossing where people can study with real others in real time. I originally built it for my little sister who has ADHD, and the whole goal is to make studying feel more fun and less lonely.

You can check it out here:
${appUrl}

I also made a short walkthrough for you here:
${loomUrl}

Right now it's still a very small team, just me and one other person, so I'm being really thoughtful about the creators I work with early. I'd love to collaborate on a couple of posts and hopefully build a longer-term relationship if it feels like a strong fit on both sides.

I'm also looking for someone to eventually help lead growth for the app longer term, so in my mind this could be more than just a typical one-off brand post with the right person. No pressure at all on that, but I wanted to mention it because I really like your taste and the way you present things online.

My budget is still pretty tight at this stage, so I'd really appreciate any flexibility on rates for the first couple of posts. As the app grows, I definitely want compensation to grow too and keep building with the people who believed in it early.

Let me know if this sounds interesting :)

Best,
Dante`,
    html: `<p>Hey!</p>
<p>I recently came across one of your videos on my foryou page and ended up checking out your account. I really loved your overall aesthetic, the fonts, music, and sound design all feel super intentional.</p>
<p>My name is Dante, and I recently launched Focustown, a cozy focus timer inspired by Animal Crossing where people can study with real others in real time. I originally built it for my little sister who has ADHD, and the whole goal is to make studying feel more fun and less lonely.</p>
<p>You can check it out here:<br><a href="${appUrl}">${appUrl}</a></p>
<p>I also made a short walkthrough for you here:<br><a href="${loomUrl}">${loomUrl}</a></p>
<p>Right now it's still a very small team, just me and one other person, so I'm being really thoughtful about the creators I work with early. I'd love to collaborate on a couple of posts and hopefully build a longer-term relationship if it feels like a strong fit on both sides.</p>
<p>I'm also looking for someone to eventually help lead growth for the app longer term, so in my mind this could be more than just a typical one-off brand post with the right person. No pressure at all on that, but I wanted to mention it because I really like your taste and the way you present things online.</p>
<p>My budget is still pretty tight at this stage, so I'd really appreciate any flexibility on rates for the first couple of posts. As the app grows, I definitely want compensation to grow too and keep building with the people who believed in it early.</p>
<p>Let me know if this sounds interesting :)</p>
<p>Best,<br>Dante</p>`,
  };
}
