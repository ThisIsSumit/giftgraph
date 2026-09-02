import { initializeApp, applicationDefault, cert, getApps } from "firebase-admin/app";
import fs from "fs";

// Avoid re-initializing on hot reload / multiple imports
if (getApps().length === 0) {
  const credential = process.env.GOOGLE_APPLICATION_CREDENTIALS
    ? cert(JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf8")))
    : applicationDefault(); // works automatically when deployed on Cloud Run in the same GCP project

  initializeApp({
    credential,
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}
