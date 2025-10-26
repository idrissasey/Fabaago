import { Component, OnInit } from '@angular/core';
import { SearchridePageModule } from "../../searchride/searchride.module";
import { firstValueFrom } from 'rxjs';
import {collection, getDocs, onSnapshot, query, where} from "firebase/firestore";
import { User } from 'firebase/auth';
import {SearchDriverService} from "../../services/search-driver.service";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule, NavController} from "@ionic/angular";

@Component({
  selector: 'app-driver-dashboard',
  templateUrl: './driver-dashboard.component.html',
  styleUrls: ['./driver-dashboard.component.scss'],
  imports: [CommonModule, IonicModule], // ✅ Ajoute ici pour activer *ngFor, *ngIf, etc.
})
export class DriverDashboardComponent implements OnInit {
  notifications: any[] = [];
  rideHistory: any[] = [];
  totalGain: number = 0;
  driverProfile: any = {};
  driverId: string | null = (window as any).firebase?.auth()?.currentUser?.uid || '';// Remplacez par l'ID du conducteur connecté
  backgroundImage = 'https://firebasestorage.googleapis.com/v0/b/taxina-b3905.firebasestorage.app/o/IUDesignPic%2FGreenPont.png?alt=media&token=6d35978e-d759-4dcc-af21-69a217c7694f';


  driverLocalisation: { lat: number; lng: number } = { lat: 0, lng: 0 }; // Initialisation avec des valeurs par défaut

  constructor(private searchDriverService: SearchDriverService,    private navCtrl: NavController) {}

  ngOnInit(): void {
    this.loadDriverProfile();
    this.listenForNotifications();
    this.loadRideHistory();
  }

  addTaxiLicenceF() {
    console.log("Ajouter une licence de taxi");
    // Implémentez la logique pour ajouter une licence de taxi
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
          where('driver_id', '==', this.driverId)
      );
      console.log("driverId : ", this.driverId, "driverProfile : ", this.driverProfile);
      const driversSnap = await getDocs(driversQuery);
      console.log("driversSnap : ", driversSnap.size, "driverProfile : ", this.driverProfile);
      for (const docSnap of driversSnap.docs) {
        this.driverProfile = docSnap.data() as User;
        console.log("driverId : ", this.driverId, "driverProfile : ", this.driverProfile);
      }
    } catch (error) {
      console.error('[SearchDriverService] Error:', error);
    }

    // onSnapshot(profileQuery, (snapshot) => {
    //   if (!snapshot.empty) {
    //     this.driverProfile = snapshot.docs[0].data();
    //   }
    // });
  }

  async listenForNotifications(): Promise<void> {

    try {
      const notificationsQuery = query(
          collection(this.searchDriverService.db, 'notifications'),
          where('user_id', '==', this.driverId),
          where('read', '==', false)
      );

      const snapshot = await getDocs(notificationsQuery);
      this.notifications = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

      // for (const docSnap of snapshot.docs) {
      //   this.driverProfile = docSnap.data() as User;
      // }
    } catch (error) {
      console.error('[SearchDriverService] Error:', error);
    }


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

      disconect() {
    // Exemple : suppression du token et redirection vers la page de connexion
    localStorage.removeItem('userId');
    this.navCtrl.navigateRoot('tabs/connexion');
  }
}
