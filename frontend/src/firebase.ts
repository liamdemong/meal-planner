import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQpKnNdpqeCyS73w9MHFRvHsZk9nMXilU",
  authDomain: "meal-planner-b8077.firebaseapp.com",
  projectId: "meal-planner-b8077",
  storageBucket: "meal-planner-b8077.firebasestorage.app",
  messagingSenderId: "616268642802",
  appId: "1:616268642802:web:483be29b7c76950931536b",
  measurementId: "G-C5WWVEWHJQ",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
