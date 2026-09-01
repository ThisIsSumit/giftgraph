import "dotenv/config";
import { giftGraph } from "./graph.js";

const prompt =
  process.argv[2] ||
  "Something for my sister who's really into hiking, budget is around $40";

const result = await giftGraph.invoke({ prompt });

console.log("\n--- Steps ---");
for (const step of result.steps) {
  console.log(`[${step.node}]`, JSON.stringify(step.output, null, 2));
}

console.log("\n--- Result ---");
console.log("Chosen product:", result.chosen.name, `($${result.chosen.price})`);
console.log("Message:", result.message);
