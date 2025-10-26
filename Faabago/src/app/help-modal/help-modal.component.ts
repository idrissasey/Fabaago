import { Component, Input } from '@angular/core';
import {IonicModule, ModalController} from '@ionic/angular';
import {SearchridePageModule} from "../searchride/searchride.module";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    // ✅ Ajoute ici pour activer *ngFor, *ngIf, etc.
  ]
})
export class HelpModalComponent {
  @Input() helpContent: string = '';
  helpImg = 'assets/images/Help_User_1.png';
  constructor(private modalCtrl: ModalController) {}

  close() {
    this.modalCtrl.dismiss();
  }

  openFullScreen() {
    window.open(this.helpImg, '_blank');
  }
}
