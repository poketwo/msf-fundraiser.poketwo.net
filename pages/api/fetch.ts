import { NextApiRequest, NextApiResponse } from "next";
import { fetchValue } from "../../lib/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.send(await fetchValue());
};

export default handler;
