import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { App } from '@capacitor/app';

import { RecaptchaVerifier, getAuth, signInWithPhoneNumber, RecaptchaParameters } from 'firebase/auth';
import {addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import {mail} from "ionicons/icons";
import {SearchDriverService} from "../services/search-driver.service";
import {ImageUploadService} from "../services/image-upload";
import { Storage, ref, uploadString, getDownloadURL } from '@angular/fire/storage'; // Assuming AngularFire

import { getStorage } from 'firebase/storage';
// Importer la liste depuis le service
import { LOCATIONS } from '../services/search-driver.service';

import { initializeApp, getApps } from 'firebase/app';
import {environment} from "../../environments/environment";
@Component({
  selector: 'app-tab4',
  templateUrl: 'inscription.page.html',
  styleUrls: ['inscription.page.scss'],
  standalone: false,
})
export class InscriptionPage {
  name = '';
  surname = '';
  dob = '';
  phone = '';
  otp = '';
  confirm: any = null;

  mail = '';
  number_sit_taxi = 4;


  countryCodes = [
    { code: '+227', label: 'NE' },
    { code: '+33', label: 'FR' },
    { code: '+1', label: 'US' },
    // Add more countries as needed
  ];

  countryCodeDefault  = this.countryCodes[0].code; // Default to the first country code
  countryCode = this.countryCodes[0]?.code;

  backgroundImage = 'https://firebasestorage.googleapis.com/v0/b/taxina-b3905.firebasestorage.app/o/IUDesignPic%2FGreenPont.png?alt=media&token=6d35978e-d759-4dcc-af21-69a217c7694f';

  currentPosition: { latitude: number; longitude: number }  = { latitude: 13, longitude: 1 };
  donneesImageToUpload: { filePath: string; imageDataUrl: string; } | null | undefined ;

  isClimatised: string = 'non';

  private app = getApps().length ? getApps()[0] : initializeApp(environment.firebaseConfig);

  private storage = getStorage(this.app,'gs://taxina-b3905.firebasestorage.app');


  getCurrentPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
            this.currentPosition = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
          },
          (error) => {
            console.error('Erreur lors de la récupération de la position :', error);
          }
      );
    } else {
      console.error('La géolocalisation n\'est pas supportée par ce navigateur.');
    }
  }



  async uploadImage( fileDestPath : string) : Promise<{ filePath: string; imageDataUrl: string } | null>  {
    try {
      const imageUrl = await this.imageService.selectAndUploadImage(fileDestPath);
      return imageUrl;
    } catch (err) {
      return null;
      console.error(err);
    }
  }



  @ViewChild('recaptchaContainer', { static: false }) recaptchaContainer!: ElementRef;
  recaptchaVerifier!: RecaptchaVerifier;



  constructor(
      private alertController: AlertController,
      private navCtrl: NavController,
      private searchDriverService : SearchDriverService,
      private imageService: ImageUploadService,
  ) {}

  ngAfterViewInit() {
    const auth = getAuth();

    const container = this.recaptchaContainer.nativeElement as HTMLElement;
    const parameters = {
      size: 'invisible',
      callback: (response: any) => {
        console.log('reCAPTCHA solved:', response);
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired, please solve again.');
      }
    };

    this.recaptchaVerifier = new RecaptchaVerifier(auth, container, parameters);

    this.recaptchaVerifier.render().catch((error) => {
      console.error('Error rendering reCAPTCHA:', error);
    });
  }



  isDriver: boolean = false;
  userType: string  = 'Passager';
  userId: string = 'Client';
  driverId: string = 'Chauffeur';
  driverLicencePicture: string | undefined = ''
  carteGrisePicture: string | undefined = ''
  taxiNumberOfficiel = "";
  taximanLicencePicture: string | undefined = '';
  password: string = '';//mdp par defaut
  selectedPicture: string | undefined = this.backgroundImage;
  vehiclePicture:  string | undefined  =  '';
  marqueModel : string = "";
  immatriculation : string  = "";


  async selectPicture() {

    this.donneesImageToUpload =  await this.uploadImage('UsersPicture');

    this.selectedPicture = this.donneesImageToUpload?.imageDataUrl;

  }


  async selectTaximanLicencePicture() {


    this.donneesImageToUpload = await this.uploadImage('DocumentOfficialPicture/Taximan_licences');
    this.taximanLicencePicture = this.donneesImageToUpload?.imageDataUrl;

  }

  async selectDriverLicencePicture() {


    this.donneesImageToUpload = await this.uploadImage('DocumentOfficialPicture/Driver_licences');
    this.driverLicencePicture = this.donneesImageToUpload?.imageDataUrl;


  }

  async selectCarteGrisePicture() {


    this.donneesImageToUpload = await this.uploadImage('DocumentOfficialPicture/CarteGrises_licences');
    this.carteGrisePicture = this.donneesImageToUpload?.imageDataUrl;


  }

  onDriverChange() {
    if (!this.isDriver) {
      this.userType = "Passager"; // Réinitialise le type d'utilisateur si la case est décochée
    }
  }


  getAreaName(lat: number, lng: number): Promise<string> {
    const apiKey = 'VOTRE_CLE_API_GOOGLE';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    return fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.results && data.results.length > 0) {
            // Cherche le quartier, la ville, etc.
            const components = data.results[0].address_components;
            const district = components.find((c: { types: string[] }) => c.types.includes('sublocality') || c.types.includes('locality'));
            return district ? district.long_name : 'Lieu inconnu'+  Math.floor(Math.random() * 1000000);// Retourne un nom de lieu générique si aucun quartier n'est trouvé
          }
          return 'Lieu inconnu'+  Math.floor(Math.random() * 1000000);// Retourne un nom de lieu générique si aucun quartier n'est trouvé
        });
  }



  async handleInscriptionUsingOTP(withOTP : boolean) {
    if (!this.otp && withOTP) {
      await this.showAlert('Erreur', 'Veuillez entrer le code reçu.');
      return;
    }

    try {
      if(withOTP){
        await this.confirm(this.otp);
      }




      if(!this.isDriver){//see if Users or Drivers

        //USER
        // Ajouter une nouvelle User dans la table "users"
        // Récupérer et incrémenter le compteur de requêtes
        // const counterRef = doc(collection(this.searchDriverService.db, "counters"), "users");

        this.userId =  ''+this.getConnectedClientId();
        localStorage.setItem('userId', this.userId);
        const userRef = doc(collection(this.searchDriverService.db, "users"), this.userId);
        try {

          const zoneAdress = await this.getAreaName(this.currentPosition.latitude, this.currentPosition.longitude);


          // Convertir la date  de naissance en objet Date
          const [day, month, year] = this.dob.split('/');
          const dateNaissance = this.dob ? new Date(Number(year), Number(month) - 1, Number(day)) : new Date();

          await setDoc(userRef, {
            user_id: this.userId,
            password: this.password,
            name: this.surname,
            last_name: this.name,
            date_birth:  dateNaissance,
            email: this.mail ? this.mail : "",
            tel_nita: this.countryCode + this.phone,
            type_user: 'Passager',
            adress: this.currentPosition ,
            picture: this.selectedPicture,
            zone_adress: zoneAdress,
            subscribe_date: new Date(),
            average_rate: 5,
            cancellation_rate: 0,
            adress_favoris_historic: [
            ],
          });

          // const usersCollection = collection(this.searchDriverService.db, 'users');
          // await addDoc(usersCollection, userRef);
          console.log('Nouvelle requête ajoutée à la base de données:', userRef);
          // this.showAlert('Succès', 'Inscription réussie et ajout dans la base!');
          // if(await this.showAlert('Succès', 'Inscription réussie et ajout dans la base!')){
          //
          // }use

          const alert = await this.alertController.create({
            header: 'Succès',
            message: 'Inscription réussie et ajout dans la base!',
            buttons: [
              { text: 'OK Super', handler: () => this.goToConnexion() },
            ],
          });
          await alert.present();

        } catch (error) {
          console.error('Erreur lors de l\'ajout de la requête:', error);
        }


      }else{
        // const counterRef = doc(collection(this.searchDriverService.db, "counters"), "drivers");

        this.driverId = 'Chauffeur'+ this.getConnectedClientId();

        const driverRef = doc(collection(this.searchDriverService.db, "drivers"), this.driverId);
        try {

          const zoneAdress = await this.getAreaName(this.currentPosition.latitude, this.currentPosition.longitude);


          // Convertir la date  de naissance en objet Date
          const [day, month, year] = this.dob.split('/');
          const dateNaissance = this.dob ? new Date(Number(year), Number(month) - 1, Number(day)) : new Date();

          await setDoc(driverRef, {
            driver_id: this.driverId,
            name: this.surname,
            last_name: this.name,
            date_birth: dateNaissance,
            email: this.mail ? this.mail : "",
            tel_nita: this.countryCode + this.phone,
            type_user: this.userType,
            adress: this.currentPosition ,
            picture: this.selectedPicture,
            zone_adress: zoneAdress,
            subscribe_date: new Date(),
            average_rate: 5,
            cancellation_rate: 0,
            status: "en ligne",
            localisation: { latitude: 13.5126, longitude: 1.3522 },
            driver_licence : this.driverLicencePicture,
            taxi_licence : this.taximanLicencePicture? this.taximanLicencePicture : "",
            number_rides : 0,
          });
          // const driversCollection = collection(this.searchDriverService.db, 'drivers');
          // await addDoc(driversCollection, driverRef);

          const alert = await this.alertController.create({
            header: 'Succès',
            message: 'Inscription réussie et ajout dans la base!',
            buttons: [
              { text: 'OK Super', handler: () => this.goToConnexion() },
            ],
          });
          await alert.present();

          console.log('Nouvelle requête ajoutée à la base de données:', driverRef);
        } catch (error) {
          console.error('Erreur lors de l\'ajout de la requête:', error);
          await this.showAlert('Erreur', 'Erreur lors de l\'ajout en base, vérifier tous les champs');
        }

      }

      //this.navCtrl.navigateForward('/tabs/connexion');

    } catch (error: any) {
      console.error(error);
      await this.showAlert('Erreur', ' verifier vos identifiants : mot de passe et numero .');
    }
  }

  async handleInscription() {

   if (await this.formControl()){


     try {
       // Vérifier si c'est un utilisateur ou un chauffeur
       const isDriver = this.isDriver;
       const idPrefix = isDriver ? 'Chauffeur' : 'Client';
       const userRefName = `${idPrefix}${this.getConnectedClientId()}`;
       const userId = ''+this.getConnectedClientId();
       const collectionName = isDriver ? 'drivers' : 'users';
       const userRef = doc(collection(this.searchDriverService.db, collectionName), userRefName);



       // Préparer les données de l'utilisateur
       const zoneAdress = await this.getAreaName(this.currentPosition.latitude, this.currentPosition.longitude);
       const [day, month, year] = this.dob.split('/');
       const dateNaissance = this.dob ? new Date(Number(year), Number(month) - 1, Number(day)) : new Date();

       const userData: any = {
         user_id: userId,
         password: this.password,
         name: this.surname,
         last_name: this.name,
         date_birth: dateNaissance,
         email: this.mail || "",
         tel_nita: this.countryCode + this.phone,
         type_user: isDriver ? this.userType : 'Passager',
         adress: this.currentPosition,
         picture: null, // L'URL sera ajoutée après l'upload
         zone_adress: zoneAdress,
         subscribe_date: new Date(),
         average_rate: 5,
         cancellation_rate: 0,
         adress_favoris_historic: [],
       };

       if (isDriver) {
         userData.status = "en ligne";
         //on considere plateau comme le centre  de niamey et des localité alentour
         userData.localisation = LOCATIONS.find(loc => loc.name === 'Plateau')?.coords || { latitude: 13.535, longitude: 2.105 };
         userData.driver_licence = null; // L'URL sera ajoutée après l'upload
         userData.taxi_licence = null; // L'URL sera ajoutée après l'upload
         userData.number_rides = 0;



       }

       // Ajouter l'utilisateur dans Firestore
       await setDoc(userRef, userData);

       // Uploader les images après l'inscription réussie
       if (this.donneesImageToUpload) {
         const storageRef = ref(this.storage, this.donneesImageToUpload.filePath);
         await uploadString(storageRef, this.donneesImageToUpload.imageDataUrl, 'data_url');
         const downloadUrl = await getDownloadURL(storageRef);

         // Mettre à jour l'URL de l'image dans Firestore
         await setDoc(userRef, { picture: downloadUrl }, { merge: true });
         this.selectedPicture = downloadUrl;
       }

       if (isDriver) {

         if (this.carteGrisePicture) {
           const carteLicenceRef = ref(this.storage, `DocumentOfficialPicture/CarteGrises_licences/${userRefName}_carteGriseLicence.jpg`);
           await uploadString(carteLicenceRef, this.carteGrisePicture, 'data_url');
           const LicenceUrl = await getDownloadURL(carteLicenceRef);
           await setDoc(userRef, { carteGrise_licence: LicenceUrl }, { merge: true });
         }

         if (this.driverLicencePicture) {
           const driverLicenceRef = ref(this.storage, `DocumentOfficialPicture/Driver_licences/${userRefName}_driverLicence.jpg`);
           await uploadString(driverLicenceRef, this.driverLicencePicture, 'data_url');
           const driverLicenceUrl = await getDownloadURL(driverLicenceRef);
           await setDoc(userRef, { driver_licence: driverLicenceUrl }, { merge: true });
         }

         if (this.taximanLicencePicture) {
           const taximanLicenceRef = ref(this.storage, `DocumentOfficialPicture/Taximan_licences/${userRefName}_taxiLicence.jpg`);
           await uploadString(taximanLicenceRef, this.taximanLicencePicture, 'data_url');
           const taximanLicenceUrl = await getDownloadURL(taximanLicenceRef);
           await setDoc(userRef, { taxi_licence: taximanLicenceUrl }, { merge: true });
         }

         // const userRef = doc(collection(this.searchDriverService.db, collectionName), userRefName);
         const idPrefixTaxi =  this.userType === "classic" ? 'TaxiClassic' : 'VehiculeParticulier';
         const taxiRefName = `${idPrefixTaxi}${this.getConnectedClientId()}`;
         const taxiRef = doc(collection(this.searchDriverService.db, 'taxis'), taxiRefName);
         await setDoc(taxiRef, {
           taxi_id: this.getConnectedClientId() + "OfficielId"+this.taxiNumberOfficiel  , // ou autre identifiant unique
           number_client_sits: this.number_sit_taxi, // ou une variable si le nombre de places est dynamique
           driver_id: userId, // l'id du chauffeur créé
           localisation: this.currentPosition,
           status: 'disponible',
           picture: this.taximanLicencePicture,
           type_taxi: this.userType, // ex: 'berline', 'classic', etc.
           climatisation: this.isClimatised === 'oui', // booléen selon le choix radio
           marqueModel: this.marqueModel , // à ajouter dans le formulaire
           subscribeDate: new Date(),
           immatriculation: this.immatriculation || "ALERTE INCONNU", // à ajouter dans le formulaire
         });

       }
       // Afficher un message de succès
       const alert = await this.alertController.create({
         header: 'Succès',
         message: 'Inscription réussie et ajout dans la base!',
         buttons: [{ text: 'OK Super', handler: () => this.goToConnexion() }],
       });
       await alert.present();

     } catch (error) {
       console.error('Erreur lors de l\'inscription:', error);
       await this.showAlert('Erreur', 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
     }

   }else{
     console.error('Erreur lors de l\'inscription:');
    // await this.showAlert('Erreur', 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
   }

  }

  /*
    async handleInscription() {




      try {

        if(!this.isDriver){//see if Users or Drivers

          //USER
          // Ajouter une nouvelle User dans la table "users"
          // Récupérer et incrémenter le compteur de requêtes
          // const counterRef = doc(collection(this.searchDriverService.db, "counters"), "users");

          this.userId = 'Client'+ this.getConnectedClientId();
          const userRef = doc(collection(this.searchDriverService.db, "users"), this.userId);
          try {


            // Upload base64

            if (this.donneesImageToUpload != null) {
              const storageRef = ref(this.storage, this.donneesImageToUpload.filePath);
              await uploadString(storageRef, this.donneesImageToUpload.imageDataUrl, 'data_url'); // Upload l'image
              const downloadUrl = await getDownloadURL(storageRef); // Récupère l'URL après l'upload
              this.selectedPicture = downloadUrl;
            } else {
              console.error("Erreur : données de l'image manquantes.");
            }


            const zoneAdress = await this.getAreaName(this.currentPosition.latitude, this.currentPosition.longitude);


            // Convertir la date  de naissance en objet Date
            const [day, month, year] = this.dob.split('/');
            const dateNaissance = this.dob ? new Date(Number(year), Number(month) - 1, Number(day)) : new Date();

            await setDoc(userRef, {
              user_id: this.userId,
              password: this.password,
              name: this.surname,
              last_name: this.name,
              date_birth:  dateNaissance,
              email: this.mail ? this.mail : "",
              tel_nita: this.countryCode + this.phone,
              type_user: 'Passager',
              adress: this.currentPosition ,
              picture: this.selectedPicture,
              zone_adress: zoneAdress,
              subscribe_date: new Date(),
              average_rate: 5,
              cancellation_rate: 0,
              adress_favoris_historic: [
              ],
            });

            // const usersCollection = collection(this.searchDriverService.db, 'users');
            // await addDoc(usersCollection, userRef);
            console.log('Nouvelle requête ajoutée à la base de données:', userRef);
            // this.showAlert('Succès', 'Inscription réussie et ajout dans la base!');
            // if(await this.showAlert('Succès', 'Inscription réussie et ajout dans la base!')){
            //
            // }







            const alert = await this.alertController.create({
              header: 'Succès',
              message: 'Inscription réussie et ajout dans la base!',
              buttons: [
                { text: 'OK Super', handler: () => this.goToConnexion() },
              ],
            });
            await alert.present();

          } catch (error) {
            console.error('Erreur lors de l\'ajout de la requête:', error);
          }


        }else{
          // const counterRef = doc(collection(this.searchDriverService.db, "counters"), "drivers");

          this.driverId = 'Chauffeur'+ this.getConnectedClientId();
          const driverRef = doc(collection(this.searchDriverService.db, "drivers"), this.driverId);
          try {


            // Upload base64

            if (this.donneesImageToUpload != null) {
              const storageRef = ref(this.storage, this.donneesImageToUpload.filePath);
              await uploadString(storageRef, this.donneesImageToUpload.imageDataUrl, 'data_url'); // Upload l'image
              const downloadUrl = await getDownloadURL(storageRef); // Récupère l'URL après l'upload
              this.selectedPicture = downloadUrl;
            } else {
              console.error("Erreur : données de l'image manquantes.");
            }


            const zoneAdress = await this.getAreaName(this.currentPosition.latitude, this.currentPosition.longitude);


            // Convertir la date  de naissance en objet Date
            const [day, month, year] = this.dob.split('/');
            const dateNaissance = this.dob ? new Date(Number(year), Number(month) - 1, Number(day)) : new Date();

            await setDoc(driverRef, {
              driver_id: this.driverId,
              password : this.password,
              name: this.surname,
              last_name: this.name,
              date_birth: dateNaissance,
              email: this.mail ? this.mail : "",
              tel_nita: this.countryCode + this.phone,
              type_user: this.userType,
              adress: this.currentPosition ,
              picture: this.selectedPicture,
              zone_adress: zoneAdress,
              subscribe_date: new Date(),
              average_rate: 5,
              cancellation_rate: 0,
              status: "en ligne",
              localisation: { latitude: 13.5126, longitude: 1.3522 },
              driver_licence : this.driverLicencePicture,
              taxi_licence : this.taximanLicencePicture? this.taximanLicencePicture : "",
              number_rides : 0,
            });
            // const driversCollection = collection(this.searchDriverService.db, 'drivers');
            // await addDoc(driversCollection, driverRef);

            const alert = await this.alertController.create({
              header: 'Succès',
              message: 'Inscription réussie et ajout dans la base!',
              buttons: [
                { text: 'OK Super', handler: () => this.goToConnexion() },
              ],
            });
            await alert.present();

            console.log('Nouvelle requête ajoutée à la base de données:', driverRef);
          } catch (error) {
            console.error('Erreur lors de l\'ajout de la requête:', error);
            await this.showAlert('Erreur', 'Erreur lors de l\'ajout en base, vérifier tous les champs');
          }

        }

        //this.navCtrl.navigateForward('/tabs/connexion');

      } catch (error: any) {
        console.error(error);
        await this.showAlert('Erreur', ' verifier vos identifiants : mot de passe et numero .');
      }
    }
  */

  getConnectedClientId(): string | null {
    //  const auth = getAuth();
    // return auth.currentUser ? auth.currentUser.uid : null;

    //let userId = Math.random().toString(36).substring(2, 15) ;
    //numero de tele unique combiné a date de naissance

    let userId = this.phone ; //+ "-"+ this.dob.replace(/\//g, "");

    return userId;
  }

  goToConnexion() {
    this.navCtrl.navigateForward('/tabs/connexion').then(
        () => {},
        (err) => {
          console.error('Navigation error:', err);
        }
    );
  }

  async handleCancel() {

    const alert = await this.alertController.create({
      header: 'Quitter l\'application',
      message: 'Voulez-vous vraiment quitter ?',
      buttons: [
        { text: 'Non', role: 'cancel' },
        { text: 'Oui', handler: () => this.goToConnexion() },
      ],
    });
    await alert.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }


  async handleSendCode() {
    if (!this.name || !this.surname || !this.dob || !this.phone || !this.password) {
      await this.showAlert('Erreur', 'Veuillez remplir tous les champs obligatoire : Nom, Prénom, Date de naissance, Téléphone et Mot de passe.');
      return;
    }

    const formattedPhone = this.formatPhoneNumber(this.countryCode, this.phone);

    if (!this.validatePhoneNumber(formattedPhone)) {
      await this.showAlert('Erreur', 'Numéro de téléphone invalide.');
      return;
    }

    // Vérifier si l'utilisateur existe déjà avec ce téléphone et ce mot de passe
    const userRef = doc(collection(this.searchDriverService.db, "users"), 'Client' + this.getConnectedClientId());
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      if (userData['tel_nita'] === formattedPhone && userData['password'] === this.password) {
        await this.showAlert('Connexion', 'Connexion réussie sans code, bienvenue !');
        this.goToConnexion();
        return;
      }
    }

    // Sinon, procéder à l'envoi du code et stocker le mot de passe à l'inscription
    //modifier après 2 erreur dans le catch utiliser la function  handleLoginWithPhoneAndPassword
// Compteur d'erreurs pour limiter à 2 tentatives avant fallback
    let errorCount = 0;
    try {
      const auth = getAuth();

      // Initialiser et rendre le reCAPTCHA

      // Initialiser et rendre le reCAPTCHA
      this.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response: any) => {
          console.log('reCAPTCHA solved:', response);
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired, please solve again.');
        }
      });

      // Appeler signInWithPhoneNumber
      const result = await signInWithPhoneNumber(auth, formattedPhone, this.recaptchaVerifier);
      this.confirm = result;
      await this.showAlert('Code envoyé', 'Veuillez vérifier votre SMS.');

      // Nettoyer le reCAPTCHA après utilisation
      this.recaptchaVerifier.clear();
      //const result = await signInWithPhoneNumber(auth, formattedPhone, this.recaptchaVerifier);
      // this.confirm = result;
      await this.showAlert('Code envoyé', 'Veuillez vérifier votre SMS.');
      errorCount = 0; // reset si succès
    } catch (error: any) {
      errorCount++;
      console.error(error);
      await this.showAlert('Erreur', error.message || 'Erreur lors de l\'envoi du code.');
      if (errorCount >= 2) {
        await this.handleLoginWithPhoneAndPassword();
        errorCount = 0;
      }
    }
  }
  // Connexion avec numéro de téléphone et mot de passe sans code OTP


  async formControl() : Promise<Boolean>{
    if (!this.name || !this.surname || !this.dob || !this.phone || !this.password) {
      await this.showAlert('Erreur champs Obligatoires', 'Veuillez entrer : Nom, Prénom, Date de Naissance, Numéro de Téléphone et Mot de Passe.');
      return false;
    }

    const formattedPhone = this.formatPhoneNumber(this.countryCode, this.phone);

    if (!this.validatePhoneNumber(formattedPhone)) {
      await this.showAlert('Erreur', 'Numéro de téléphone invalide au Niger.');
      return false;
    }

    // Vérification du mot de passe par regex (au moins 6 caractères, lettres et chiffres)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(this.password)) {
      await this.showAlert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères, dont des lettres et des chiffres.');
      return false;
    }

    if(this.isDriver){

      if(!this.driverLicencePicture || !this.vehiclePicture || !this.immatriculation || !this.marqueModel){
        await this.showAlert('Erreur', 'Vous êtes Chauffeur, fournissez ses informations : photo permis de conduire valide, photo vehicule, ' +
            '\n remplir champ immatriculation et marqueModel de votre vehicule');
        return false;
      }

      if(this.userType == "classic"){
        if(!this.taximanLicencePicture || !this.taxiNumberOfficiel){
          await this.showAlert('Erreur', 'Vous êtes Chauffeur Taximan, fournissez ses informations : photo licence Taximan, ' +
              '\n remplir champ numero Taxi');
          return false;
        }
      }

    }

    return true;
  }


  async handleLoginWithPhoneAndPassword() {

    this.formControl();
    const formattedPhone = this.formatPhoneNumber(this.countryCode, this.phone);
    // Recherche de l'utilisateur dans la base
    const userRef = doc(collection(this.searchDriverService.db, "users"), 'Client' + this.getConnectedClientId());
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      if (userData['tel_nita'] === formattedPhone && userData['password'] === this.password) {
        await this.showAlert('Connexion', 'Connexion réussie !');
        this.goToConnexion();
        return;
      }
    }else{ //inscription sans code OTP
      this.handleInscriptionUsingOTP(false);
    }

    await this.showAlert('Erreur', 'Numéro ou mot de passe incorrect.');
  }


  formatPhoneNumber(countryCode: string, phone: string): string {
    // Remove any non-digit characters from the phone number
    const cleanedPhone = phone.replace(/\D/g, '');
    return `${countryCode}${cleanedPhone}`;
  }

  validatePhoneNumber(phone: string): boolean {
    // Valide uniquement les numéros du Niger : +227XXXXXXXX à modifier pour d'autre PAYS
    const nigerPhoneRegex = /^\+227\d{8}$/;

    console.log("Validation du numéro :", phone, "=>", nigerPhoneRegex.test(phone));
    return nigerPhoneRegex.test(phone);
  }
  async selectVehiclePicture() {

    this.donneesImageToUpload = await this.uploadImage('DocumentOfficialPicture/Driver_licences');
    this.vehiclePicture = this.donneesImageToUpload?.imageDataUrl;
  }
}


