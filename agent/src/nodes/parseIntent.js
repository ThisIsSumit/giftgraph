import { ChatAnthropic } from "@langchain/anthropic";
import { z } from "zod";

const IntentSchema = z.object({
  recipient: z.string().describe("who the gift is for, e.g. 'sister', 'coworker'"),
  interest: z
    .enum(["hiking", "coffee", "books", "tech", "home", "wellness", "fitness", "food"])
    .describe("closest matching interest category for the recipient"),
  budget: z.number().describe("max budget in USD; if not mentioned, default to 40"),
});

const model = new ChatAnthropic({
  model: "claude-sonnet-4-5",
  temperature: 0,
}).withStructuredOutput(IntentSchema, { name: "extract_intent" });

export async function parseIntent(state) {
  const result = await model.invoke([
    {
      role: "system",
      content:
        "Extract gifting intent from the user's message. Pick the single closest interest category from the allowed enum, even if it's an imperfect match. If no budget is mentioned, use 40.",
    },
    { role: "user", content: state.prompt },
  ]);

  return {
    recipient: result.recipient,
    interest: result.interest,
    budget: result.budget,
    steps: { node: "parse_intent", output: result },
  };
}
