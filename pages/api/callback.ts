import crypto from "crypto";
import { withIronSessionApiRoute } from "iron-session/next";
import absoluteUrl from "next-absolute-url";
import oauth from "../../lib/oauth";
import { ironSessionOptions } from "../../lib/session";
import { checkout } from "../../lib/stripe";

const handler = withIronSessionApiRoute(async (req, res) => {
  const { code, state } = req.query;

  if (!req.session.id) return res.status(401).send("Missing session ID");
  if (!req.session.amount) return res.status(400).send("Missing amount");
  if (typeof code !== "string") return res.status(400).send("Missing code");
  if (typeof state !== "string") return res.status(400).send("Missing state");

  const currentState = crypto
    .createHash("sha256")
    .update(req.session.id)
    .digest("hex");

  if (currentState !== state) return res.status(401).send("Invalid state");

  const { origin } = absoluteUrl(req);

  const token = await oauth.tokenRequest({
    code,
    grantType: "authorization_code",
    scope: "identify email",
    redirectUri: `${origin}/api/callback`,
  });

  const user = await oauth.getUser(token.access_token);
  if (!user) return res.status(400).send("Failed to authenticate");

  const session = await checkout({
    currency: "USD",
    user: {
      ...user,
      avatar: user.avatar ?? null,
      mfa_enabled: !!user.mfa_enabled,
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product: process.env.TEST_MODE
            ? "prod_Kf94LTHSJjqsrP"
            : "prod_Kf94xExNn3icbL",
          unit_amount: req.session.amount,
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: origin,
  });

  if (!session.url) return res.status(500).end("Missing session URL");

  req.session.destroy();
  res.redirect(session.url).end();
}, ironSessionOptions);

export default handler;
