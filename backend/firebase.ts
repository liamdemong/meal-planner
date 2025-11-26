import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// 1. Check if the variable exists (helps debug later)
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error("Missing FIREBASE_SERVICE_ACCOUNT environment variable");
}

// 2. Parse the string back into an object
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT,
) as ServiceAccount;

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

export { db };
