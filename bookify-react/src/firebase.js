import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBxwnhBepOVOWojJ973FO8DOfL153iXSVc",
  authDomain: "bookifydb-a368c.firebaseapp.com",
  databaseURL: "https://bookifydb-a368c-default-rtdb.firebaseio.com",
  projectId: "bookifydb-a368c",
  storageBucket: "bookifydb-a368c.appspot.com",
  messagingSenderId: "416508769490",
  appId: "1:416508769490:web:fa5d34347f4d356cf5a90b",
  measurementId: "G-5BG9V2K9NX"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
