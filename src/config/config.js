// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqAquEmCTXm3eKAc100akq9sWz9-2n6H4",
  authDomain: "chat-app-4920f.firebaseapp.com",
  projectId: "chat-app-4920f",
  storageBucket: "chat-app-4920f.appspot.com",
  messagingSenderId: "750475395832",
  appId: "1:750475395832:web:52571e3bf51e634292b10d",
  measurementId: "G-96E48SHC93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export default app