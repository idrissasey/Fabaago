import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
//import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { Storage, ref, uploadString, getDownloadURL } from '@angular/fire/storage'; // Assuming AngularFire

import { getStorage } from 'firebase/storage';
import { environment} from "../../environments/environment";

import { initializeApp, getApps } from 'firebase/app';



@Injectable({
    providedIn: 'root'
})
export class ImageUploadService {
    private app = getApps().length ? getApps()[0] : initializeApp(environment.firebaseConfig);

    private storage = getStorage(this.app,'gs://taxina-b3905.firebasestorage.app');


    constructor() {


    }

    async takePicture() {
        try {
            // 1. Get the photo from camera or gallery
            const photo = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl, // Get the image as a Data URL
                source: CameraSource.Prompt // Ask user to choose camera or gallery
            });

            if (photo.dataUrl) {
                // 2. Define storage path and reference
                const filePath = `user_uploads/${new Date().getTime()}.jpeg`; // Unique file path
                const storageRef = ref(this.storage, filePath);

                // 3. Upload the image (Data URL format)
                const uploadTask = await uploadString(storageRef, photo.dataUrl, 'data_url');
                console.log('Upload complete!');

                // 4. Get the download URL
                const downloadURL = await getDownloadURL(storageRef);
                console.log('File available at:', downloadURL);

                // You can now save this downloadURL to Firestore or use it directly
                // For example: this.firestore.collection('photos').add({ url: downloadURL });

            }
        } catch (e) {
            console.error('Error taking or uploading picture:', e);
        }
    }



/*
    async selectAndUploadImage(fileDestPath: string): Promise<string | null> {
        try {
            // Ouvrir la galerie ou la caméra
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Prompt // Choix entre galerie et appareil photo
            });

            const imageDataUrl = image.dataUrl;
            const fileName = `image_${new Date().getTime()}.jpg`;
            const filePath = `${fileDestPath}/${fileName}`; // Dossier dans Firebase Storage

            const storageRef = ref(this.storage, filePath);

            // Upload base64
            if (imageDataUrl != null) {
                await uploadString(storageRef, imageDataUrl, 'data_url');
            } else {
                return null;
            }

            // Obtenir l'URL publique
            const downloadUrl = await getDownloadURL(storageRef);

            // Ici, on retourne l'URL pour l'utiliser uniquement si l'ajout en base est réussi
            return downloadUrl;

        } catch (error) {
            console.error('Erreur lors du chargement ou de l’upload:', error);
            return null;
        }


    }*/

    async selectAndUploadImage(fileDestPath: string): Promise<{ filePath: string; imageDataUrl: string } | null> {
        try {
            // Ouvrir la galerie ou la caméra
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Prompt // Choix entre galerie et appareil photo
            });

            if (image.dataUrl) {
                const fileName = `image_${new Date().getTime()}.jpg`;
                const filePath = `${fileDestPath}/${fileName}`; // Dossier dans Firebase Storage

                // Retourner les informations nécessaires pour l'upload
                return { filePath, imageDataUrl: image.dataUrl };
            } else {
                return null;
            }
        } catch (error) {
            console.error('Erreur lors de la sélection de l’image:', error);
            return null;
        }
    }

}
