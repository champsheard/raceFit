import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDqCBhwpAA67Wz8MmGlYXLtzA3vya25K5c",
  authDomain: "racefit-df3f4.firebaseapp.com",
  projectId: "racefit-df3f4",
  storageBucket: "racefit-df3f4.firebasestorage.app",
  messagingSenderId: "824103556829",
  appId: "1:824103556829:web:1aab11f263e17a7d84ad34"
};


const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

export { app, auth, db };


