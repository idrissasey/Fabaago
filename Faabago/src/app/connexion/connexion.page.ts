import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { RecaptchaVerifier, getAuth, signInWithPhoneNumber } from 'firebase/auth';
import {collection, getDocs, getFirestore, query, where} from "firebase/firestore";

@Component({
  selector: 'app-connexion',
  templateUrl: 'connexion.page.html',
  styleUrls: ['connexion.page.scss'],
  standalone: false,
})
export class ConnexionPage {


  backgroundImage = 'https://firebasestorage.googleapis.com/v0/b/taxina-b3905.firebasestorage.app/o/IUDesignPic%2FGreenPont.png?alt=media&token=6d35978e-d759-4dcc-af21-69a217c7694f';
//codeSMS 522552 SMSVerif SMS gs://taxina-b3905.firebasestorage.app/IUDesignPic/Green & Orange Simple Food Delivery Instagram Story (2).png
  phone = '';
  otp = '';
  confirm: any = null;

  isDriver: boolean = false;
  userId: string = (window as any).firebase?.auth()?.currentUser?.uid || '';// Remplacez par l'ID du conducteur connecté

  onDriverChange() {
    if (this.isDriver) {
      this.isDriver = true; // Réinitialise le type d'utilisateur si la case est décochée
    }
  }

  countryCodes = [

    {code: '+227', label: 'NE'},
    {code: '+33', label: 'FR'},
    // Add more countries as needed
  ];
  countryCodeDefault  = this.countryCodes[0].code; // Default to the first country code
  countryCode = this.countryCodes[0]?.code;

  @ViewChild('recaptchaContainer', {static: false}) recaptchaContainer!: ElementRef;
  recaptchaVerifier!: RecaptchaVerifier;
  password: string = '';

  constructor(
      private alertController: AlertController,
      private navCtrl: NavController
  ) {
  }

  ngAfterViewInit() {
    const auth = getAuth();

    // Ensure the element is correctly referenced
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


  async handleSendCode() {
    if (!this.phone) {
      await this.showAlert('Erreur', 'Veuillez entrer votre numéro de téléphone.');
      this.navCtrl.navigateForward('/tabs-users');
      // this.navCtrl.navigateForward('/tabs-drivers/tab2');
      return;
    }

    const formattedPhone = this.formatPhoneNumber(this.countryCode, this.phone);

    if (!this.validatePhoneNumber(formattedPhone)) {
      await this.showAlert('Erreur', 'Numéro de téléphone invalide.');
      return;
    }
   // let errorCounta = 0;
    screen
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
     // this.recaptchaVerifier.clear();
      //const result = await signInWithPhoneNumber(auth, formattedPhone, this.recaptchaVerifier);
      // this.confirm = result;
      await this.showAlert('Code envoyé', 'Veuillez vérifier votre SMS.');
      //errorCount = 0; // reset si succès
    } catch (error: any) {
      console.error(error);
      await this.showAlert('Erreur', error.message || 'Erreur lors de l\'envoi du code.');
    }
  }


  async handleConfirmCode() {
    if (!this.otp) {
      await this.showAlert('Erreur', 'Veuillez entrer le code reçu.');
      return;
    }

    try
    {
    //trouver un autre usercredential : le generer par hasard car on utilise plus la connexion par firebase, on utilise notre function local
    //verification email et mdp

      // Générer un faux userCredential pour la connexion locale (exemple)
// Ici, ajoutez la logique de vérification email et mot de passe selon votre fonction locale
// const userCredential = await this.confirm.confirm(this.otp);

      this.userId = Math.random().toString(36).substring(2, 15) ;

      await this.showAlert('Succès', 'ConnexionPage réussie !');

      //this.userId = (window as any).firebase?.auth()?.currentUser?.uid;
      console.log(this.userId , "userIdddd");

      localStorage.setItem('userId', this.userId);


      if(!this.isDriver){//see if Users or Drivers
        this.navCtrl.navigateForward('/tabs-users/tab1'); // Redirect to user page or wherever appropriate
      }else{
        this.navCtrl.navigateForward('/driver-dashboard'); // Redirect to driver page or wherever appropriate
      }
    } catch (error: any) {
      console.error(error);
      await this.showAlert('Erreur', 'Code incorrect.');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
  private _db = getFirestore(); // Utiliser getFirestore pour obtenir l'instance Firestore

  async connexion() {


    if (!this.phone) {
      await this.showAlert('Erreur', 'Veuillez entrer votre numéro de téléphone.');
    //  this.navCtrl.navigateForward('/tabs-users');
      // this.navCtrl.navigateForward('/tabs-drivers/tab2');
      return;
    }

    if ( !this.password) {
      await this.showAlert('Erreur', 'Veuillez entrer votre mot de passe.');
      //  this.navCtrl.navigateForward('/tabs-users');
      // this.navCtrl.navigateForward('/tabs-drivers/tab2');
      return;
    }

    const formattedPhone = this.formatPhoneNumber(this.countryCode, this.phone);


    if (!this.validatePhoneNumber(formattedPhone)) {
      await this.showAlert('Erreur', 'Numéro de téléphone indddddvalide.');
      return;
    }




if(this.isDriver) {
  try {
    const usersQuery = query(
        collection(this._db, 'drivers'),
        where('user_id', '==', this.phone)
    );

    const usersSnap = await getDocs(usersQuery);
    console.log(usersSnap.size, " driversSnap size");
    for (const docSnap of usersSnap.docs) {
      console.log("docSnap : ", docSnap.data());
      const driver = docSnap.data() as any;
      const idPhone = driver.tel_nita
        const idPassword = driver.password

      const data = docSnap.data();
      if(idPhone !== formattedPhone || idPassword !== this.password){
        await this.showAlert('Erreur', 'Numéro de téléphone ou mot de passe incorrect.');
        return;
      }else {
        this.userId = this.phone;
        await this.showAlert('Succès', 'ConnexionPage réussie !');

        //this.userId = (window as any).firebase?.auth()?.currentUser?.uid;
        console.log(this.userId, "userIdddd");

        localStorage.setItem('userId', this.userId);
     //   this.navCtrl.navigateForward('/driver-dashboard'); // Redirect to driver page or wherever appropriate
        this.navCtrl.navigateForward('/tabs-drivers');
      }


      this.userId = this.phone;
      await this.showAlert('Echec', 'Connexion non réussie, verifier vos identifiants !');

      //this.userId = (window as any).firebase?.auth()?.currentUser?.uid;
      // console.log(this.userId, "userIdddd");
      //
      // localStorage.setItem('userId', this.userId);

    }
  } catch (error) {
    console.error(error);
    await this.showAlert('Erreur', 'Erreur lors de la connexion. Veuillez vérifier vos informations.');
    return;

  }

}else {

  try {
    console.log("formattedPhone : =====*/*****/*/*/*/*======= ", formattedPhone, " this.phone : ", this.phone);
    const usersQuery = query(
        collection(this._db, 'users'),
        where('user_id', '==', this.phone)
    );

    const usersSnap = await getDocs(usersQuery);
    console.log(usersSnap.size, " driversSnap size  " + usersSnap);
    for (const docSnap of usersSnap.docs) {

      console.log("docSnap : ", docSnap.data());
      const driver = docSnap.data() as any;
      const idPhone = driver.tel_nita;
      const idPassword = driver.password;

      const data = docSnap.data();

      console.log( "data : ", data, " idPhone : ", idPhone, " idPassword : ", idPassword +" formattedPhone : ",formattedPhone, " this.password : ", this.password );
      if(idPhone !== formattedPhone || idPassword !== this.password){
        await this.showAlert('Erreur', 'Numéro de téléphone ou mot de passe incorrect.');
        return;
      }else {
        this.userId = this.phone;
        await this.showAlert('Succès', 'ConnexionPage réussie !');

        //this.userId = (window as any).firebase?.auth()?.currentUser?.uid;
        console.log(this.userId, "userIdddd");

        localStorage.setItem('userId', this.userId);
       // this.navCtrl.navigateForward('/user-dashboard'); // Redirect to driver page or wherever appropriate
        this.navCtrl.navigateForward('/tabs-users');
      }


      this.userId = this.phone;
      await this.showAlert('Succès', 'ConnexionPage réussie !');

      //this.userId = (window as any).firebase?.auth()?.currentUser?.uid;
      console.log(this.userId, "userIdddd");

      localStorage.setItem('userId', this.userId);

    }
  } catch (error) {
    console.error(error);
    await this.showAlert('Erreur', 'Erreur lors de la connexion. Veuillez vérifier vos informations.');
    return;

  }

}

    //     this.userId = this.phone;
    // await this.showAlert('Succès', 'ConnexionPage réussie !');
    //
    // //this.userId = (window as any).firebase?.auth()?.currentUser?.uid;
    // console.log(this.userId , "userIdddd");
    //
    // localStorage.setItem('userId', this.userId);

    //
    // if(!this.isDriver){//see if Users or Drivers
    //   this.navCtrl.navigateForward('/tabs-users/tab1'); // Redirect to user page or wherever appropriate
    // }else{
    //   this.navCtrl.navigateForward('/driver-dashboard'); // Redirect to driver page or wherever appropriate
    // }

  }


  goToSubscribe() {
    this.navCtrl.navigateForward('/tabs/tab4'); // Redirect to home page or wherever appropriate
  }

  formatPhoneNumber(countryCode: string, phone: string): string {
    const cleanedPhone = phone.replace(/\D/g, '');
    console.log('aaaaaaaaaaaa ',`${countryCode}${cleanedPhone}` , " formatted phone number");
    return `${countryCode}${cleanedPhone}`;
  }

  validatePhoneNumber(phone: string): boolean {
    // Valide uniquement les numéros du Niger : +227XXXXXXXX à modifier pour d'autre PAYS
    const nigerPhoneRegex = /^\+227\d{8}$/;

    console.log("Validation du numéro :", phone, "=>", nigerPhoneRegex.test(phone));
    return nigerPhoneRegex.test(phone);
  }


}
