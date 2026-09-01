import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Reads GOOGLE_API_KEY from process.env automatically (Google AI Studio key)
const model = new ChatGoogleGenerativeAI({ model: "gemini-2.0-flash", temperature: 0.7 });

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
