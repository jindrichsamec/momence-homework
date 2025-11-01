import { fetchCnbDataAsJson } from "./cnb/apiClient";
import type { VercelRequest, VercelResponse } from "@vercel/node";

import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api", async (_req, res) => {
  const jsonData = await fetchCnbDataAsJson();
  res.json(jsonData);
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  const jsonData = await fetchCnbDataAsJson();
  res.status(200).json(jsonData);
}
