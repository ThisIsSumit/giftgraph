import products from "../products.json" with { type: "json" };

// Local implementation reads the seed JSON file. In the deployed version,
// swap this body for a Firestore query:
//   db.collection("products").where("tags", "array-contains", interest).get()
export async function searchCatalog(state) {
  const tag = state.interest;

  let matches = products.filter((p) => p.tags.includes(tag));

  // If the first pass (post-relaxation) still finds nothing, fall back to
  // any product at all so the graph always terminates with a recommendation.
  if (matches.length === 0 && state.relaxed) {
    matches = products;
  }

  return {
    candidates: matches,
    steps: { node: "search_catalog", output: { tag, relaxed: state.relaxed, count: matches.length } },
  };
}
