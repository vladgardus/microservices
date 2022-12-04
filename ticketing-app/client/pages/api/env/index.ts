import { NextApiRequest, NextApiResponse } from "next";

export default function env(req: NextApiRequest, res: NextApiResponse<string>) {
  // res.status(200).json(process.env.API_BASE_URL ?? "");
  res.status(200).json("");
}
