import { StateGraph, END } from "@langchain/langgraph";
import { GiftState } from "./state.js";
import { parseIntent } from "./nodes/parseIntent.js";
import { searchCatalog } from "./nodes/searchCatalog.js";
import { checkBudget } from "./nodes/checkBudget.js";
import { draftMessage } from "./nodes/draftMessage.js";

const graph = new StateGraph(GiftState)
  .addNode("parse_intent", parseIntent)
  .addNode("search_catalog", searchCatalog)
  .addNode("check_budget", checkBudget)
  .addNode("draft_message", draftMessage)
  .addEdge("__start__", "parse_intent")
  .addEdge("parse_intent", "search_catalog")
  .addEdge("search_catalog", "check_budget")
  // The one real branch point: if check_budget found nothing affordable,
  // it set relaxed=true and left `chosen` unset — route back to search_catalog.
  // Otherwise move on to drafting the message.
  .addConditionalEdges("check_budget", (state) =>
    state.chosen ? "draft_message" : "search_catalog"
  )
  .addEdge("draft_message", END);

export const giftGraph = graph.compile();
