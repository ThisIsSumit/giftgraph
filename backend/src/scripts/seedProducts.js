import "dotenv/config";
import { db } from "../services/firestore.js";
import products from "../../../agent/src/products.json" with { type: "json" };

async function seed() {
  const batch = db.batch();
  for (const p of products) {
    batch.set(db.collection("products").doc(p.id), p);
  }
  await batch.commit();
  console.log(`Seeded ${products.length} products into Firestore.`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
