import "./firebaseApp.js";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

export async function saveSession({ userId, prompt, steps, result }) {
  await db.collection("sessions").add({
    userId,
    prompt,
    steps,
    result,
    createdAt: new Date().toISOString(),
  });
}

export { db };
