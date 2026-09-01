import { Annotation } from "@langchain/langgraph";

// Shared state that flows through every node in the graph.
// Each node reads what it needs and returns a partial update;
// LangGraph merges it into this state automatically.
export const GiftState = Annotation.Root({
  prompt: Annotation(),          // raw user input, e.g. "something for my sister who likes hiking, budget $50"
  recipient: Annotation(),       // extracted by parse_intent
  interest: Annotation(),        // extracted by parse_intent
  budget: Annotation(),          // extracted by parse_intent
  candidates: Annotation(),      // product list from search_catalog
  relaxed: Annotation({          // whether we've already retried with a relaxed search
    default: () => false,
  }),
  chosen: Annotation(),          // final picked product
  message: Annotation(),         // final drafted gift note
  steps: Annotation({            // running log of steps, for the "thinking steps" UI later
    default: () => [],
    reducer: (existing, update) => [...existing, update],
  }),
});
