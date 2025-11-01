import { fetchCnbDataAsJson } from "../src/server/cnb/apiClient";
import express from "express";

const app = express();

app.get("/api", async (_req, res) => {
  const jsonData = await fetchCnbDataAsJson();
  res.json(jsonData);
});

export default app;
