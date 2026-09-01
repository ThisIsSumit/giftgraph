export async function checkBudget(state) {
  const withinBudget = state.candidates.filter((p) => p.price <= state.budget);

  if (withinBudget.length === 0 && !state.relaxed) {
    // Nothing fit — signal the graph to loop back to search_catalog once,
    // with relaxed=true so it broadens instead of looping forever.
    return {
      relaxed: true,
      steps: { node: "check_budget", output: { withinBudget: 0, action: "relaxing search" } },
    };
  }

  const pool = withinBudget.length > 0 ? withinBudget : state.candidates;
  // Rank by closeness to budget (best value nearest the ceiling) rather than just cheapest.
  const chosen = [...pool].sort((a, b) => (state.budget - a.price) - (state.budget - b.price))[0];

  return {
    chosen,
    steps: { node: "check_budget", output: { withinBudget: withinBudget.length, chosen: chosen.id } },
  };
}
