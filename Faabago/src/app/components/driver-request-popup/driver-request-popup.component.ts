import { Component, OnInit , Inject} from '@angular/core';
import { Firestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {IonicModule, NavController} from "@ionic/angular";

@Component({
  selector: 'app-driver-request',
  templateUrl: './driver-request-popup.component.html',
  imports: [
    IonicModule
  ],
  styleUrls: ['./driver-request-popup.component.scss']
})



export class RequestPopupComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<RequestPopupComponent> ,               private navCtrl: NavController
  ) {}

  respond(accepted: boolean): void {
    this.dialogRef.close({ accepted });
  }

  disconect() {
    // Exemple : suppression du token et redirection vers la page de connexion
    localStorage.removeItem('userId');
    this.navCtrl.navigateRoot('tabs/connexion');
  }
}
