import "dotenv/config";
import express from "express";
import cors from "cors";
import agentRouter from "./routes/agent.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/agent", agentRouter);

// Central error handler - keeps route handlers free of try/catch boilerplate
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "Internal server error" });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`GiftGraph backend listening on :${port}`);
});
