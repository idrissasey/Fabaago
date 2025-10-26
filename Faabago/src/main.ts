import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// src/main.ts
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

// Importez Firebase et les services que vous utilisez
import { initializeApp } from 'firebase/app';
// Importez d'autres services Firebase si nécessaire
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Assurez-vous d'importer getFirestore

// Configuration Firebase
export const firebaseConfig = {
    apiKey: "AIzaSyBydZmc6oxi_1y278fHjz5TVFhzSH_WzBw",
    authDomain: "taxina-b3905.firebaseapp.com",
    projectId: "taxina-b3905",
    storageBucket: "taxina-b3905.appspot.com",
    messagingSenderId: "75812535477",
    appId: "1:75812535477:web:0f418b1aed67737f9392fc",
    measurementId: "G-VRWCXETYGP",
};


try {
    // Initialisation de Firebase
    const app = initializeApp(firebaseConfig); // Utilisation correcte de `const` pour `app`
    const auth = getAuth(app);
    const db = getFirestore(app);
    console.log("Firebase initialisé avec succès.");
} catch (error) {
    console.error("Erreur lors de l'initialisation de Firebase :", error);
    // Vous pouvez également utiliser Alert pour afficher l'erreur à l'utilisateur
}


if (environment.production) {
    enableProdMode();
}

// Call the element loader before the bootstrapModule/bootstrapApplication call
defineCustomElements(window);

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
