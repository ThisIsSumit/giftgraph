import { ChatAnthropic } from "@langchain/anthropic";

const model = new ChatAnthropic({ model: "claude-sonnet-4-5", temperature: 0.7 });

export async function draftMessage(state) {
  const { chosen, recipient } = state;

  const result = await model.invoke([
    {
      role: "system",
      content:
        "Write a warm, specific 2-3 sentence gift note. Mention the product naturally, don't sound like an ad, no emojis.",
    },
    {
      role: "user",
      content: `Recipient: ${recipient}\nProduct: ${chosen.name} - ${chosen.description}`,
    },
  ]);

  return {
    message: result.content,
    steps: { node: "draft_message", output: { message: result.content } },
  };
}
