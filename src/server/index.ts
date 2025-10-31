import { fetchCnbDataAsJson } from "./cnbApiClient.ts";

import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api", async (req, res) => {
  const jsonData = await fetchCnbDataAsJson();
  res.json(jsonData);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
