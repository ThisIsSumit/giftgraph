import { initializeApp, applicationDefault, cert, getApps } from "firebase-admin/app";
import fs from "fs";

// Avoid re-initializing on hot reload / multiple imports
if (getApps().length === 0) {
  let credential;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    // Production (Render, Cloud Run, etc.) - the whole key JSON passed as one env var,
    // since there's no file on disk to point at in most container platforms.
    credential = cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON));
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Local dev - path to the downloaded service account JSON file.
    credential = cert(JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf8")));
  } else {
    // Deployed on GCP itself (Cloud Run in the same project) - picks up the attached service account automatically.
    credential = applicationDefault();
  }

  initializeApp({
    credential,
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}