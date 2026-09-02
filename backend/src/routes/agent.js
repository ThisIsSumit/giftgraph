import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";
import { runAgentStream } from "../services/runAgent.js";
import { saveSession } from "../services/firestore.js";

const router = Router();

router.post("/run", verifyFirebaseToken, async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "prompt is required" });
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders?.();

  const steps = [];
  let result = null;

  try {
    for await (const event of runAgentStream(prompt)) {
      if (event.type === "step") {
        steps.push({ node: event.node, output: event.output, timestamp: Date.now() });
        res.write(`event: step\ndata: ${JSON.stringify({ node: event.node, output: event.output })}\n\n`);
      } else if (event.type === "done") {
        result = event.result;
        res.write(`event: done\ndata: ${JSON.stringify(result)}\n\n`);
      }
    }

    await saveSession({ userId: req.userId, prompt, steps, result });
  } catch (err) {
    console.error("agent run failed:", err);
    res.write(`event: error\ndata: ${JSON.stringify({ message: "Agent run failed" })}\n\n`);
  } finally {
    res.end();
  }
});

export default router;
