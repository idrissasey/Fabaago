import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // ✅ Compat service
import { SearchridePageModule } from "../../searchride/searchride.module";
import { firstValueFrom } from 'rxjs';
import {collection, getDocs, query, where} from "firebase/firestore";
import { User } from 'firebase/auth';
import {SearchDriverService} from "../../services/search-driver.service";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {IonicModule, NavController} from "@ionic/angular";

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
  imports: [
    SearchridePageModule,
    CommonModule,
    IonicModule,
    // ✅ Ajoute ici pour activer *ngFor, *ngIf, etc.
  ]
})

export class UserDashboardComponent implements OnInit {
  userProfile: any = {};
  rideHistory: any[] = [];

  backgroundImage = 'https://firebasestorage.googleapis.com/v0/b/taxina-b3905.firebasestorage.app/o/IUDesignPic%2FGreenPont.png?alt=media&token=6d35978e-d759-4dcc-af21-69a217c7694f';

  userId: string | null = (window as any).firebase?.auth()?.currentUser?.uid || '';


  constructor(              private navCtrl: NavController, private searchDriverService: SearchDriverService) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadRideHistory();
  }

  // ✅ Add async
  async loadUserProfile(): Promise<void> {

    const userId = localStorage.getItem('userId');

    this.userId = userId;
    console.log( "userIdddd",this.userId);
    try {
      const usersQuery = query(
          collection(this.searchDriverService.db, 'users'),
          where('user_id', '==', this.userId)
      );

      const usersSnap = await getDocs(usersQuery);

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

  disconect() {
    // Exemple : suppression du token et redirection vers la page de connexion
    localStorage.removeItem('userId');
    this.navCtrl.navigateRoot('tabs/connexion');
  }
}
