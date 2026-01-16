import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

// TODO: Replace with your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDU41udhvXgLUkWQkVwjLD3ZkLPlPHkNiI",
    authDomain: "mobile-programming-d7040.firebaseapp.com",
    projectId: "mobile-programming-d7040",
    storageBucket: "mobile-programming-d7040.firebasestorage.app",
    messagingSenderId: "730510956878",
    appId: "1:730510956878:web:81c44e006f29a46205661f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export default app;
