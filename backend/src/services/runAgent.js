import { giftGraph } from "../../../agent/src/graph.js";

// Wraps giftGraph.stream() (LangGraph's built-in node-by-node streaming) into
// a simple async generator the route can loop over and forward as SSE events.
export async function* runAgentStream(prompt) {
  const stream = await giftGraph.stream({ prompt }, { streamMode: "updates" });

  const finalState = {};

  for await (const chunk of stream) {
    // chunk looks like: { [nodeName]: partialStateReturnedByThatNode }
    for (const [node, update] of Object.entries(chunk)) {
      const { steps, ...rest } = update; // `steps` is just the node's own log entry, already implied by `node`/`rest`
      Object.assign(finalState, rest);
      yield { type: "step", node, output: rest };
    }
  }

  yield {
    type: "done",
    result: { product: finalState.chosen, message: finalState.message },
  };
}
