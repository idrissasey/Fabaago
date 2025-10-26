import { Component } from '@angular/core';
import {SearchDriverService} from "../services/search-driver.service";
import {collection, getDocs, query, where} from "firebase/firestore";
import {User} from "firebase/auth";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  userProfile: any = {};
  rideHistory: any[] = [];

  backgroundImage = 'https://firebasestorage.googleapis.com/v0/b/taxina-b3905.firebasestorage.app/o/IUDesignPic%2FGreenPont.png?alt=media&token=6d35978e-d759-4dcc-af21-69a217c7694f';
  profilDefaultImg = 'assets/images/219983.png';

  userId: string | null = (window as any).firebase?.auth()?.currentUser?.uid || '';

  constructor(private  navCtrl : NavController, private searchDriverService: SearchDriverService) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadRideHistory();
  }

  disconect() {
    // Exemple : suppression du token et redirection vers la page de connexion
    localStorage.removeItem('userId');
    this.navCtrl.navigateRoot('tabs/connexion');
  }




  // ✅ Add async
  async loadUserProfile(): Promise<void> {

    const userId = localStorage.getItem('userId');

    this.userId = userId;

    try
    {
    console.log("userId : ", this.userId, "userProfile : ", this.userProfile);
      const usersQuery = query(
          collection(this.searchDriverService.db, 'users'),
          where('user_id', '==', this.userId)
      );

      const usersSnap = await getDocs(usersQuery);

      if (usersSnap.empty) {
        this.disconect();
        return;
      }

      for (const docSnap of usersSnap.docs) {
        this.userProfile = docSnap.data() as User;
      }
    } catch (error) {
      console.error('[SearchDriverService] Error:', error);
    }
  }

  // ✅ Add async
  async loadRideHistory(): Promise<void> {
    try {
      const ridesQuery = query(
          collection(this.searchDriverService.db, 'rides'),
          where('user_id', '==', this.userId)
      );

      const ridesSnap = await getDocs(ridesQuery);

      for (const docSnap of ridesSnap.docs) {
        const ride = docSnap.data();
        this.rideHistory.push(ride);
      }
    } catch (error) {
      console.error('[SearchDriverService] Error:', error);
    }
  }



}
