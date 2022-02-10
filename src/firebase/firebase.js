import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDpYVAUPLF0-TlJ229D4u7HmmMnquvs_YM",
    authDomain: "thi-moon-c0ad2.firebaseapp.com",
    databaseURL: "https://thi-moon-c0ad2-default-rtdb.firebaseio.com",
    projectId: "thi-moon-c0ad2",
    storageBucket: "thi-moon-c0ad2.appspot.com",
    messagingSenderId: "706719114049",
    appId: "1:706719114049:web:d9d91ac62a603feec5b7c0",
    measurementId: "G-L3M38HSDX6"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);
export { auth, database };