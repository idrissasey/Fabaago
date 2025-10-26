import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';

import { GoogleMapsModule } from '@angular/google-maps';
import { MapPickerComponent } from './components/map-picker/map-picker.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { DriverDashboardComponent } from './components/driver-dashboard/driver-dashboard.component';
import { SearchridePageModule } from './searchride/searchride.module';
import {HelpModalComponent} from "./help-modal/help-modal.component";

//import { WaitingPage } from './waiting/waiting.page'; // adapte le chemin si nécessaire



@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    GoogleMapsModule,
    MapPickerComponent,
    SearchridePageModule,
    UserDashboardComponent,
    DriverDashboardComponent,
    HelpModalComponent,
    // ✅ Initialize Firebase properly
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
  ],
  exports: [MapPickerComponent, UserDashboardComponent, DriverDashboardComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
