import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import type { FirebaseApp } from "firebase/app";
import type { Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDiOXWa5ndYOq9rlyWt8oSvIBPaVszFvis",
  authDomain: "meditaskpro-c666e.firebaseapp.com",
  projectId: "meditaskpro-c666e",
  storageBucket: "meditaskpro-c666e.firebasestorage.app",
  messagingSenderId: "286397026234",
  appId: "1:286397026234:web:45a3d1b0038de8ea809783",
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export const getDb = (): Firestore => {
  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
  return db!;
};
