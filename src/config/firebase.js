'use client';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import Axios from 'axios';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const GoogleProvider = new GoogleAuthProvider();
const auth = getAuth(app);

// const analytics = getAnalytics(app);

async function signInWithGooglePopup() {
    try {
        await signInWithPopup(auth, GoogleProvider).then(async (result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.idToken;
            // const displayName = result.user.displayName;
            // console.log(result.user);
            await Axios.post(`${import.meta.env.VITE_SERVER}/register`, {credential: credential, user: result.user}).then((res) => {
                console.log(res);
                return 1;
            }).catch((err)=>{
                console.log(err);
            });
        });
    }
    catch (err) {
        console.log(err);
        return 0;
    }
}

export {
    auth,
    GoogleProvider
}