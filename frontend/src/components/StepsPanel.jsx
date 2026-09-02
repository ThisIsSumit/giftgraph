const STEP_LABELS = {
  parse_intent: "Reading your request",
  search_catalog: "Searching the catalog",
  check_budget: "Checking the budget",
  draft_message: "Writing the note",
};

function labelFor(node, output) {
  if (node === "check_budget" && output?.action === "relaxing search") {
    return "Nothing fit — widening the search";
  }
  return STEP_LABELS[node] || node;
}

export default function StepsPanel({ steps, isRunning }) {
  if (steps.length === 0) return null;

  return (
    <ol className="steps-trail">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <li key={i} className="steps-trail-item">
            <span className={`steps-dot ${isLast && isRunning ? "steps-dot-active" : "steps-dot-done"}`} />
            <span className="steps-label">{labelFor(step.node, step.output)}</span>
          </li>
        );
      })}
    </ol>
  );
}
