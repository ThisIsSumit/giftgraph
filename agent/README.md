# GiftGraph Agent

## Setup
```
npm install
npm install dotenv
cp .env.example .env
# then edit .env and paste your Google AI Studio key (https://aistudio.google.com/apikey)
```

## Run
```
npm run test:agent
# or with a custom prompt:
node src/test.js "gift for my coworker who loves coffee, budget $30"
```

## Graph
parse_intent -> search_catalog -> check_budget -> (draft_message | search_catalog if nothing in budget) -> END

- parse_intent: Gemini (via Google AI Studio) extracts {recipient, interest, budget} via structured output
- search_catalog: filters src/products.json by interest tag (swap for Firestore query later)
- check_budget: filters by budget, ranks, picks winner; loops back once with relaxed=true if nothing fits
- draft_message: Gemini writes the gift note

This is the standalone agent. Express API + React UI + Firebase/GCP deploy come next.
