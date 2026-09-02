import { getAuth } from "firebase-admin/auth";
import "../services/firebaseApp.js"; // ensures the Admin SDK app is initialized before use

export async function verifyFirebaseToken(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing Authorization bearer token" });
  }

  try {
    const decoded = await getAuth().verifyIdToken(token);
    req.userId = decoded.uid;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
