// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Tu configuración de Firebase, obtenida desde la consola de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDWRnmo1DktTa-vYg3RUo0QKELctmxOiC8",
  authDomain: "imageuploader-fef85.firebaseapp.com",
  projectId: "imageuploader-fef85",
  storageBucket: "imageuploader-fef85.firebasestorage.app",
  messagingSenderId: "882303620898",
  appId: "1:882303620898:web:3baff76424e342b5d5377b"
};

// Inicializa Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exporta el servicio de autenticación
export const auth = getAuth(app);