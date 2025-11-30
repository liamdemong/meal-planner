import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// 1. Check if the variable exists
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error("Missing FIREBASE_SERVICE_ACCOUNT environment variable");
}

// Parse the string back into an object
const serviceAccountRaw: any = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (serviceAccountRaw.private_key) {
  serviceAccountRaw.private_key = serviceAccountRaw.private_key.replace(
    /\\n/g,
    "\n"
  );
}

const serviceAccount = serviceAccountRaw as ServiceAccount;

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

export { db };
