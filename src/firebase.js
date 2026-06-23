import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9GIgdgKTE0MXVxdnaO4dPH_3s_qmC-c0",
  authDomain: "liquid-sylph-366116.firebaseapp.com",
  projectId: "liquid-sylph-366116",
  storageBucket: "liquid-sylph-366116.firebasestorage.app",
  messagingSenderId: "153320489235",
  appId: "1:153320489235:web:f78d1018c584d37839dae6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
