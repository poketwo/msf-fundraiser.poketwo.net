import crypto from "crypto";
import { withIronSessionApiRoute } from "iron-session/next";
import absoluteUrl from "next-absolute-url";
import oauth from "../../lib/oauth";
import { ironSessionOptions } from "../../lib/session";

const handler = withIronSessionApiRoute(async (req, res) => {
  return res.status(400).send("Fundraiser has ended");

  const { amount: _amount } = req.query;

  const amount = Number(_amount);
  if (!Number.isInteger(amount)) return res.status(400).send("Invalid Amount");
  if (amount < 300) return res.status(400).send("Amount too low");

  req.session.id = crypto.randomBytes(16).toString("hex");
  req.session.amount = amount;
  await req.session.save();

  const state = crypto
    .createHash("sha256")
    .update(req.session.id)
    .digest("hex");

  const { origin } = absoluteUrl(req);

  const url = oauth.generateAuthUrl({
    state,
    scope: "identify email",
    redirectUri: `${origin}/api/callback`,
  });

  res.redirect(url).end();
}, ironSessionOptions);

export default handler;
