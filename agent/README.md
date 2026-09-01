# GiftGraph Agent

## Setup
```
npm install
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env
npm install dotenv
```

## Run
```
npm run test:agent
# or with a custom prompt:
node src/test.js "gift for my coworker who loves coffee, budget $30"
```

## Graph
parse_intent -> search_catalog -> check_budget -> (draft_message | search_catalog if nothing in budget) -> END

- parse_intent: LLM extracts {recipient, interest, budget} via structured output
- search_catalog: filters src/products.json by interest tag (swap for Firestore query later)
- check_budget: filters by budget, ranks, picks winner; loops back once with relaxed=true if nothing fits
- draft_message: LLM writes the gift note

This is the standalone agent. Express API + React UI + Firebase/GCP deploy come next.
