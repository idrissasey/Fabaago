import { Component } from '@angular/core';
import {SearchDriverService} from "../services/search-driver.service";
import {collection, getDocs, onSnapshot, query, where} from "firebase/firestore";
import {User} from "firebase/auth";
import {NavController, ToastController} from "@ionic/angular";
import {Request} from "../services/search-driver.service";
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {

  request: any[] = [];
  rideHistory: any[] = [];
  totalGain: number = 0;
  driverProfile: any = {};
  driverId: string | null = (window as any).firebase?.auth()?.currentUser?.uid || '';// Remplacez par l'ID du conducteur connecté

  backgroundImage = 'https://firebasestorage.googleapis.com/v0/b/taxina-b3905.firebasestorage.app/o/IUDesignPic%2FGreenPont.png?alt=media&token=6d35978e-d759-4dcc-af21-69a217c7694f';


  profilDefaultImg = 'assets/images/219983.png';


  constructor(private navCtrl: NavController,
              private searchDriverService: SearchDriverService,
              private toastCtrl: ToastController) {}

  ngOnInit(): void {
    this.loadDriverProfile();

    this.loadRideHistory();
  }

  addTaxiLicenceF() {
    console.log("Ajouter une licence de taxi");
    // Implémentez la logique pour ajouter une licence de taxi
  }

  disconect() {
    // Exemple : suppression du token et redirection vers la page de connexion
    localStorage.removeItem('userId');
    this.navCtrl.navigateRoot('tabs/connexion');
  }

  async loadDriverProfile(): Promise<void> {
    //const profileRef = collection(this.firestore, 'drivers');
    // const profileQuery = query(profileRef, where('id', '==', this.driverId));
// Pour récupérer :
    const userId = localStorage.getItem('userId');

    this.driverId = userId;
    console.log(this.driverId , "driverIdddd",'Chauffeur'+this.driverId);
    try {
      const driversQuery = query(
          collection(this.searchDriverService.db, 'drivers'),
          where('user_id', '==', this.driverId)
      );
      console.log("driverId : ", this.driverId, "driverProfile : ", this.driverProfile);
      const driversSnap = await getDocs(driversQuery);
      console.log("driversSnap : ", driversSnap.size, "driverProfile : ", this.driverProfile);

      if (driversSnap.empty) {
        this.disconect();
        return;
      }

      for (const docSnap of driversSnap.docs) {
        this.driverProfile = docSnap.data() as User;
        console.log("driverId : ", this.driverId, "driverProfile : ", this.driverProfile);
      }

      // 🔔 On démarre l’écoute des request une fois le profil chargé
      this.listenForRequest();

    } catch (error) {
      console.error('[SearchDriverService] Error:', error);
    }

    // onSnapshot(profileQuery, (snapshot) => {
    //   if (!snapshot.empty) {
    //     this.driverProfile = snapshot.docs[0].data();
    //   }
    // });
  }

  async listenForRequest(): Promise<void> {
    console.log('🟢 Listening for request for driverId:', this.driverId);

    try {
      const reqQuery = query(
          collection(this.searchDriverService.db, 'requests'),
          where('drivers_notified_Id', 'array-contains', this.driverId)
      );
      const driversSnap = await getDocs(reqQuery);
      for (const docSnap of driversSnap.docs) {
        let requestData = docSnap.data() as Request;
        if (requestData.drivers_notified_Id && requestData.drivers_notified_Id.includes(<string>this.driverId)) {
          this.request.push(requestData);
          console.log("Requête ajoutée pour driverId :", this.driverId, "drivers_notified_Id :", requestData.drivers_notified_Id);
        }
      }



      // 🔥 Écoute en temps réel
      // onSnapshot(reqQuery, (snapshot) => {
      //   snapshot.docChanges().forEach(async (change) => {
      //
      //     if (change.type === 'added') {
      //       console.log('🟢 Listening for request for driverId:', this.driverId);
      //       const newNotif = { id: change.doc.id, ...change.doc.data() };
      //
      //       // Éviter les doublons
      //       const exists = this.request.find(n => n.id === newNotif.id);
      //       if (!exists) {
      //         this.request.unshift(newNotif);
      //         await this.showToast('📩 Nouvelle demande reçue');
      //         console.log('➕ Nouvelle notification ajoutée :', newNotif);
      //       }
      //     }
      //   });
      // });
    } catch (error) {
      console.error('[DriverHome] Error listening for request:', error);
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'success'
    });
    await toast.present();
  }


  async loadRideHistory(): Promise<void> {

    const ridesQuery = query(
        collection(this.searchDriverService.db, 'rides'),
        where('user_id', '==', this.driverId),
    );

    const snapshot = await getDocs(ridesQuery);


    onSnapshot(ridesQuery, (snapshot: { docs: any[]; }) => {
      this.rideHistory = snapshot.docs.map(doc => doc.data());
      this.totalGain = this.rideHistory.reduce((sum, ride) => sum + ride.fare, 0);
    });
  }

  acceptNotification(notificationId: string): void {
    console.log(`Notification ${notificationId} acceptée.`);
    // Implémentez la logique pour accepter une notification
  }

  rejectNotification(notificationId: string): void {
    console.log(`Notification ${notificationId} rejetée.`);
    // Implémentez la logique pour rejeter une notification
  }

  addLicenceF() {

  }




}
