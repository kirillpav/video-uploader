// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	onAuthStateChanged,
	User,
} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDg76RRTwqBor54SiN3So7hdHwRx_ux2Fg",
	authDomain: "video-uploader-6ebd2.firebaseapp.com",
	projectId: "video-uploader-6ebd2",
	appId: "1:982874721379:web:07b9c6d790757ab70f3c56",
	measurementId: "G-L3MS8WFJ65",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export function signInWithGoogle() {
	return signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOut() {
	return auth.signOut();
}

export function onAuthStateChangedHelper(
	callback: (user: User | null) => void
) {
	return onAuthStateChanged(auth, callback);
}
