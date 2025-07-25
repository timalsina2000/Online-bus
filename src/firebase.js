import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getStorage } from "firebase/storage";


//this is the firebase api
const firebaseConfig = {
    apiKey: "AIzaSyARK4ga1FZNfz_HOzGkO0nfItbYm3Rezbs",
    authDomain: "login-d17ca.firebaseapp.com",
    projectId: "login-d17ca",
    storageBucket: "login-d17ca.appspot.com",
    messagingSenderId: "846402202253",
    appId: "1:846402202253:web:e84d7e9140dcade4a350c4",
    measurementId: "G-WY4VZJDL0N"
  };

  const app = initializeApp(firebaseConfig);

  export const auth = getAuth();
  export const db = getFirestore(app);
  export const storage = getStorage(app);
  

  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6LcF1h8qAAAAANXcsiNwQpQG6OS56xYe-k4pFllY'),
    isTokenAutoRefreshEnabled: true
  });
  

  export default app;