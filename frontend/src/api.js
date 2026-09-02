import { auth } from "./firebase.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// EventSource can't send a POST body or custom headers, so we parse the
// SSE stream manually off a fetch() response instead.
export async function runAgent(prompt, { onStep, onDone, onError }) {
  const idToken = await auth.currentUser.getIdToken();

  const response = await fetch(`${API_BASE}/agent/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok || !response.body) {
    onError?.(new Error(`Request failed: ${response.status}`));
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop(); // last chunk may be incomplete, keep it for next read

    for (const raw of events) {
      const lines = raw.split("\n");
      const eventLine = lines.find((l) => l.startsWith("event:"));
      const dataLine = lines.find((l) => l.startsWith("data:"));
      if (!eventLine || !dataLine) continue;

      const eventType = eventLine.replace("event:", "").trim();
      const data = JSON.parse(dataLine.replace("data:", "").trim());

      if (eventType === "step") onStep?.(data);
      if (eventType === "done") onDone?.(data);
      if (eventType === "error") onError?.(new Error(data.message));
    }
  }
}
