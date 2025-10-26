import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, OnDestroy } from '@angular/core';
import {ModalController, IonicModule, NavController} from '@ionic/angular';
import { NgForOf, DatePipe } from '@angular/common';

@Component({
  selector: 'app-drivers-modal',
  templateUrl: './DriversModalComponent.page.html',
  styleUrls: ['./DriversModalComponent.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonicModule,
  ]
})
export class DriversModalComponentPage implements OnInit, OnDestroy {

  @Input() waitTime = 120; // en secondes
  remainingSeconds = 0;
  progressValue = 1;
  deadlineTime = '';
  currentAd: any;
  currentAdIndex = 0;
  remainingTime!: number;
  intervalId: any;
  nextExpectedTime!: string;

  ads = [
    { image: 'assets/ad1.jpg', text: '🍔 Découvrez les meilleurs burgers en ville !' },
    { image: 'assets/ad2.jpg', text: '🚗 Gagnez des réductions sur vos prochains trajets !' },
    { image: 'assets/ad3.jpg', text: '☕ Prenez un café pendant l’attente avec -20% !' }
  ];

  private countdownInterval: any;
  private adInterval: any;

  // constructor(private modalCtrl: ModalController) {}
  backgroundImage = 'https://firebasestorage.googleapis.com/v0/b/taxina-b3905.firebasestorage.app/o/IUDesignPic%2FGreenPont.png?alt=media&token=6d35978e-d759-4dcc-af21-69a217c7694f';

  constructor(private modalCtrl: ModalController,
              private navCtrl: NavController) {}


  ngOnInit() {
    this.remainingSeconds = this.waitTime;
    const now = new Date();
    const deadline = new Date(now.getTime() + this.waitTime * 1000);
    this.deadlineTime = deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.remainingTime = this.waitTime;
    this.updateNextExpectedTime();


    this.startCountdown();
    this.startAdRotation();
  }

  /** 🕐 Calcule l’heure prévue de réponse */
  updateNextExpectedTime() {
    const now = new Date();
    now.setSeconds(now.getSeconds() + this.waitTime);
    this.nextExpectedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  /** ⏱️ Lance le compte à rebours */
  startCountdown() {
    this.intervalId = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        clearInterval(this.intervalId);
      }
    }, 1000);
  }


  /** 🔁 Change automatiquement la publicité toutes les 5 secondes */
  startAdRotation() {
    setInterval(() => {
      this.currentAdIndex = (this.currentAdIndex + 1) % this.ads.length;
    }, 5000);
  }

  closeModal() {
    clearInterval(this.countdownInterval);
    clearInterval(this.adInterval);
    this.modalCtrl.dismiss();
  }

  ngOnDestroy() {
    clearInterval(this.countdownInterval);
    clearInterval(this.adInterval);
  }

  close() {
    clearInterval(this.countdownInterval);
    this.modalCtrl.dismiss();
  }

  /** Format mm:ss pour le timer */
  get formattedTime(): string {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }


  disconect() {
    // Exemple : suppression du token et redirection vers la page de connexion
    localStorage.removeItem('userId');
    this.navCtrl.navigateRoot('tabs/connexion');
  }
}
