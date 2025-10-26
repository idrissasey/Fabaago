import { Component, ElementRef, ViewChild } from '@angular/core';
import {AlertController, ModalController, NavController} from '@ionic/angular';
import {RecaptchaVerifier, getAuth, signInWithPhoneNumber, User} from 'firebase/auth';
import {LOCATIONS, SearchDriverService} from '../services/search-driver.service';
import {addDoc, collection, doc, DocumentData, DocumentReference, GeoPoint, getDoc, getDocs, query, setDoc, where} from 'firebase/firestore';
import {MapPickerComponent} from "../components/map-picker/map-picker.component";
import {DriversModalComponentPage} from "../DriversModalComponent/DriversModalComponent.page";
import * as XLSX from 'xlsx';
import { Geolocation } from '@capacitor/geolocation';
import {FirebaseSeedService} from "../services/firebase-seed.service";
// Importer la liste depuis le service
import {DriverResult} from '../services/search-driver.service';
import {HelpModalComponent} from "../help-modal/help-modal.component";
import {alert} from "ionicons/icons";
@Component({
  selector: 'app-searchride',
  templateUrl: 'searchride.page.html',
  styleUrls: ['searchride.page.scss'],
  standalone: false,
})
export class SearchridePage {

  backgroundImage = 'https://firebasestorage.googleapis.com/v0/b/taxina-b3905.firebasestorage.app/o/IUDesignPic%2FGreenPont.png?alt=media&token=6d35978e-d759-4dcc-af21-69a217c7694f';


    // Phone number and OTP for Firebase authentication
  phone = '';
  otp = '';
  confirm: any = null;
  countryCode = '+1'; // Default country code, adjust as needed

  countryCodes = [
    { code: '+261', label: 'MG' },
    { code: '+33', label: 'FR' },
    { code: '+1', label: 'US' },
    // Add more countries as needed
  ];

  // @ViewChild('recaptchaContainer', { static: false }) recaptchaContainer!: ElementRef;
  // recaptchaVerifier!: RecaptchaVerifier;



 // locations: any[] = [];

  loading = false;
  number_client: number = 1;
  private firebaseSeedService: FirebaseSeedService | undefined;
    banniereVoiture = 'assets/images/banniere_recherche_course.JPG';
    userProfile: any = {};
    userId: string | null = (window as any).firebase?.auth()?.currentUser?.uid || '';


    constructor(private searchDriverService: SearchDriverService,   private alertController: AlertController,
              private navCtrl: NavController, private  modalController : ModalController) {}

  // Utiliser la liste importée des quartiers de niamey
  locations = LOCATIONS;
  driversResults:  DriverResult[] = [];
  selectedOriginFromList: { lat: number, lng: number } | null = null;
  selectedDestinationFromList: { lat: number, lng: number } | null = null;
  originSelectedFromMap: any = null;
  destinationSelectedFromMap: any = null;


  origin: { lat: number; lng: number } | null = null;
  destination: { lat: number; lng: number } | null = null;

 async onOriginSelected(event: any): Promise<void> {
    this.originSelectedFromMap = event;
    this.selectedOriginFromList = await this.findLocationByCoords(event);
    console.log("Selected origin from lis:", this.selectedOriginFromList);
  }

 async onDestinationSelected(event: any): Promise<void> {
    this.destinationSelectedFromMap = event;
    this.selectedDestinationFromList = await this.findLocationByCoords(event);
  }


    async openHelpModal() {
        const modal = await this.modalController.create({
            component: HelpModalComponent,
            cssClass: 'help-modal',
            componentProps: {
                helpContent: `
        <h3>Suivez les étapes ci-dessous</h3>
        <p>Découvrez comment rechercher un chauffeur en quelques secondes.</p>
      `
            },
            showBackdrop: true,
            backdropDismiss: true
        });
        await modal.present();
    }



  async seedData() {
    // @ts-ignore
    await this.firebaseSeedService.seedFirestore();
  }

    disconect() {
        // Exemple : suppression du token et redirection vers la page de connexion
        localStorage.removeItem('userId');
        this.navCtrl.navigateRoot('tabs/connexion');
    }

  @ViewChild('mapPicker') mapPicker!: MapPickerComponent;

  locationPermissionGranted: boolean = false;


  async ngAfterViewInit() {
    await customElements.whenDefined('gmp-map');

    const map = document.querySelector('gmp-map') as any;
    const marker = document.getElementById('marker') as any;
    const strictBoundsInputElement = document.getElementById('use-strict-bounds') as HTMLInputElement;
    const placePicker = document.getElementById('place-picker') as any;
    const infowindowContent = document.getElementById('infowindow-content') as HTMLElement;
    const infowindow = new google.maps.InfoWindow();

    map.innerMap.setOptions({ mapTypeControl: false });
    infowindow.setContent(infowindowContent);



    const setupClickListener = (id: string, type: string) => {
      const radioButton = document.getElementById(id)!;
      radioButton.addEventListener('click', () => {
        placePicker.type = type;
      });
    };

    setupClickListener('changetype-all', '');
    setupClickListener('changetype-address', 'address');
    setupClickListener('changetype-establishment', 'establishment');
    setupClickListener('changetype-geocode', 'geocode');

    strictBoundsInputElement.addEventListener('change', () => {
      placePicker.strictBounds = strictBoundsInputElement.checked;
    });

    this.loadUserProfile();
  }

  async ngOnInit() {
    await this.requestLocationPermissionUntilGranted();
  //  this.loadMap();
  }

  async requestLocationPermissionUntilGranted() {
    let permission = await Geolocation.checkPermissions();
    while (permission.location !== 'granted') {
      await Geolocation.requestPermissions();
      permission = await Geolocation.checkPermissions();
    }
    this.locationPermissionGranted = true;
  }

  async checkLocationPermission() {
    const permission = await Geolocation.checkPermissions();
    if (permission.location === 'granted') {
      this.locationPermissionGranted = true;
    } else {
      const request = await Geolocation.requestPermissions();
      this.locationPermissionGranted = request.location === 'granted';
    }
  }

  loadMap() {
     // Logique pour charger la carte
    this.mapPicker.initializeMap();

   // this.mapPicker.setCurrentLocationAsOrigin(); // 👉 Centrer la carte automatiquement sur l'utilisateur
  }

  onQuartierSelected(type: 'origin' | 'destination', selectedCoords: any): void {

    if (type === 'origin') {
      this.selectedOriginFromList = selectedCoords;
      this.originSelectedFromMap = selectedCoords;
      if (this.mapPicker && selectedCoords) {
        this.mapPicker.originSelected.emit(selectedCoords);
        this.mapPicker.map.setCenter(selectedCoords);
        this.mapPicker.addMarker(selectedCoords, 'A', true);
      }
    } else if (type === 'destination') {
      this.selectedDestinationFromList = selectedCoords;
      this.destinationSelectedFromMap = selectedCoords;
      if (this.mapPicker && selectedCoords) {
        this.mapPicker.destinationSelected.emit(selectedCoords);
        //this.mapPicker.map.setCenter({selectedCoords.lat, selectedCoords.lng});
        this.mapPicker.addMarker(selectedCoords, 'B', false);
      }
    }
  }
//here we return null a corriger TODO


 async findLocationByCoords(coords: any) {
    const found = this.locations.find(loc => loc.coords.lat === coords.lat && loc.coords.lng === coords.lng);
    if (found) {
      console.log("Found in list:", found);
      return found.coords;
    } else {
      console.log("Not found in list, adding new location.");
      // Si non trouvé, ajouter une nouvelle entrée avec un nom générique
      // Utiliser la fonction getAreaName pour obtenir un nom basé sur les coordonnées
      // Note: getAreaName est asynchrone, donc ici on devrait gérer ça correctement
      // Pour simplifier, on va juste ajouter un nom temporaire et mettre à jour plus tard
      const areaName = await this.getAreaName(coords.lat, coords.lng);
      // @ts-ignore
      this.locations.push({ name: areaName, coords });

      console.log(areaName, "AERANAME HOLALA", coords);
      console.log(this.locations);

      // Exporter la liste mise à jour
     // this.exportLocationsToXLS();

      return coords;
    }
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

  async getAreaName(lat: number, lng: number): Promise<string> {
    const apiKey = 'AIzaSyBydZmc6oxi_1y278fHjz5TVFhzSH_WzBw';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    console.log('📍 [getAreaName] Called with:', { lat, lng });

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK' || !data.results?.length) {
        console.warn('⚠️ Aucun résultat trouvé');
        return `Lieu inconnu_${Math.floor(Math.random() * 1000000)}`;
      }

      // 🔍 Recherche de Lazaret et Niamey
      let sublocality = '';
      let cityCountry = '';

      for (const result of data.results) {
        if (!result.address_components) continue;

        for (const comp of result.address_components) {
          const types = comp.types || [];

          // Récupère le quartier (Lazaret)
          if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
            sublocality = comp.long_name;
          }

          // Récupère la ville et le pays (Niamey, Niger)
          if (types.includes('locality')) {
            cityCountry = comp.long_name;
          }
          if (types.includes('country')) {
            cityCountry += `, ${comp.long_name}`;
          }
        }
      }

      // 🔗 Concatène les deux parties si présentes
      let areaName = '';
      if (sublocality && cityCountry) areaName = `${sublocality}, ${cityCountry}`;
      else if (sublocality) areaName = sublocality;
      else if (cityCountry) areaName = cityCountry;
      else areaName = data.results[0].formatted_address || `Lieu inconnu_${Math.floor(Math.random() * 1000000)}`;

        areaName = this.removeDuplicateWords(areaName);
      console.log('✅ [getAreaName] Résultat final:', areaName);
      return areaName;

    } catch (err) {
      console.error('💥 [getAreaName] Erreur:', err);
      return `Lieu inconnu_${Math.floor(Math.random() * 1000000)}`;
    }
  }

   removeDuplicateWords(str: string): string {
    const words = str.split(/\s+/);
    const uniqueWords = Array.from(new Set(words));
    return uniqueWords.join(' ');
  }

  exportLocationsToXLS(): void {
    const data = this.locations.map(location => ({
      Nom: location.name,
      Latitude: location.coords.lat,
      Longitude: location.coords.lng
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Locations');

    XLSX.writeFile(workbook, 'locations.xlsx');
  }



  /*  * Calculate the distance between two geographical points using the Haversine formula.
  *  * @param lat1 - Latitude of the first point in degrees.
  * *  @param lon1 - Longitude of the first point in degrees.
  * * @param lat2 - Latitude of the second point in degrees.
  * * @param lon2 - Longitude of the second point in degrees.
  * * @param unit - The unit of measurement for the distance ('K' for kilometers, 'N' for nautical miles, 'M' for miles).
  * * @returns The distance between the two points in the specified unit.
  * * This function uses the Haversine formula to calculate the distance between two points on the Earth specified by their latitude and longitude.
  * */
   distance(lat1 : number, lon1: number, lat2: number, lon2: number, unit: String) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      return dist;
    }
  }




  latitude: number = 13.5176;
  longitude: number = 2.3522;
  center = { lat :this.latitude, lng: this.longitude };
  zoom = 12;


  getConnectedClientId(): string | null {
    const auth = getAuth();
    let userId = localStorage.getItem("userId");

    return userId;
  }

  departureComment: string = '';
  arrivalComment: string = '';


  //TODO ADD CLIENT TABLE USE THIS METHOD TO SET ID
  private driverModalController: any;
  async search(
      coordOrigine: { lat: number; lng: number } | null,
      coordDestination: { lat: number; lng: number } | null
  ) {
    this.loading = true;
    console.log("Recherche de conducteurs disponibles...");

    const from = coordOrigine
        ? { latitude: coordOrigine.lat, longitude: coordOrigine.lng }
        : null;
    const to = coordDestination
        ? { latitude: coordDestination.lat, longitude: coordDestination.lng }
        : null;

    if (!from || !to) {
      await this.showAlert(
          'Erreur',
          'Veuillez sélectionner un point de départ et une destination.'
      );
      this.loading = false;
      return;
    }

    this.driversResults = await this.searchDriverService.findAvailableDrivers(
        from,
        to,
        this.number_client
    );
    console.log(`${this.driversResults.length} conducteurs trouvés.`);

    this.loading = false;

    if (this.driversResults.length === 0) {
      await this.showAlert('Aucun conducteur', 'Veuillez réessayer plus tard.');
      return;
    }

    // ✅ Crée une seule requête "request"
    const counterRef = doc(collection(this.searchDriverService.db, "counters"), "requests");
    let requestId = 1;
    const counterSnap = await getDoc(counterRef);
    if (counterSnap.exists()) {
      requestId = (counterSnap.data()['count'] || 0) + 1;
    }
    await setDoc(counterRef, { count: requestId });

    const driversNotified = this.driversResults.map(dr => dr.driver.user_id);

    const requestRef = doc(
        collection(this.searchDriverService.db, "requests"),
        `request${requestId}`
    );

    await setDoc(requestRef, {
      request_id: `request${requestId}`,
      client_id: this.getConnectedClientId(),
      drivers_notified_Id: driversNotified,
      from: coordOrigine,
      to: coordDestination,
      comment_depart_zone: this.departureComment,
      comment_arrival_zone: this.arrivalComment,
      estimate_price_per_client: this.driversResults[0].estimatedPrice,
      lastUpdate: new Date().toISOString(),
      number_client: this.number_client || 1,
      estimate_depart_hour: new Date(Date.now()),
      estimate_arrival_hour: new Date(Date.now() + 60 * 60 * 1000),
      distance: this.driversResults[0].rideDistance,
      search_zone_distanceKM: this.searchDriverService.MAX_DISTANCE_KM,
      status: "onWaiting"
    });

    console.log('Nouvelle requête créée:', requestRef.id);

    // ✅ Lance la notification et la gestion d’attente
    await this.notifyDriversAndWaitForResponse(coordOrigine, coordDestination, requestRef, driversNotified);
  }

  // async search(coordOrigine: { lat: number; lng: number } | null, coordDestination: { lat: number; lng: number } | null) {
  //   this.loading = true;
  //   console.log("Recherche de conducteurs disponibles...");
  //
  //   //données de test
  //   const fromTest = new GeoPoint(13.5176, 2.3522); // Origine
  //   const toTest = new GeoPoint(48.8606, 2.3376);   // Destination
  //
  //   const from = coordOrigine ? { latitude: coordOrigine.lat, longitude: coordOrigine.lng } : null;
  //   const to = coordDestination ? { latitude: coordDestination.lat, longitude: coordDestination.lng } : null;
  //
  //   // Recherche des conducteurs disponibles
  //   if(from === null || to === null ) {
  //     // @ts-ignore
  //     this.showAlert('Veuillez sélectionner un point de départ et une destination.');
  //   }else{
  //     this.driversResults = await this.searchDriverService.findAvailableDrivers(from, to, this.number_client);
  //     console.log(this.driversResults.length + " ahaAAHHHA conducteurs trouvés.");
  //   }
  //   this.loading = false;
  //
  //   this.showAlert('Recherche terminée. Nombre de conducteurs trouvés : ' ,""+ this.driversResults.length + " from " + from?.latitude + " to " + to);
  //   if (this.driversResults.length > 0) {//Si des conducteurs sont trouvés on ajoute la requête dans la table requests et on notifie les conducteurs trouvés
  //
  //
  //     // Pour chaque conducteur disponible, ajouter une nouvelle requête dans la table "requests"
  //     for (const driverResult of this.driversResults) {
  //       // Récupérer et incrémenter le compteur de requêtes
  //       const counterRef = doc(collection(this.searchDriverService.db, "counters"), "requests");
  //       let requestId = 1;
  //       const counterSnap = await getDoc(counterRef);
  //       if (counterSnap.exists()) {
  //         requestId = (counterSnap.data()['count'] || 0) + 1;
  //       }
  //       await setDoc(counterRef, { count: requestId });
  //
  //       const requestRef = doc(collection(this.searchDriverService.db, "requests"), `request${requestId}`);
  //       try {
  //         await setDoc(requestRef, {
  //           request_id: `request${requestId}`,
  //           client_id: this.getConnectedClientId(),
  //           drivers_notified_Id: [driverResult.driver.user_id],
  //           from: coordOrigine,
  //           to: coordDestination,
  //           comment_depart_zone: this.departureComment,
  //           comment_arrival_zone: this.arrivalComment,
  //           estimate_price_per_client: driverResult.estimatedPrice,
  //           lastUpdate: new Date().toISOString(),
  //           number_client: this.number_client || 1,
  //           estimate_depart_hour: new Date(Date.now()),
  //           estimate_arrival_hour: new Date(Date.now() + 60 * 60 * 1000),
  //           distance: driverResult.rideDistance,
  //           search_zone_distanceKM: this.searchDriverService.MAX_DISTANCE_KM,
  //           status: "onWaiting"
  //         });
  //         console.log('Nouvelle requête ajoutée à la base de données:', requestRef);
  //         await this.notifyDriversAndWaitForResponse(coordOrigine, coordDestination, requestRef);
  //       } catch (error) {
  //         console.error('Erreur lors de l\'ajout de la requête:', error);
  //       }
  //     }
  //     if (this.driversResults.length === 0) {
  //       await this.showAlert('Aucun conducteur disponible', 'Veuillez réessayer plus tard : Dans 15 minutes .');
  //     }
  //
  //
  //   } else {
  //     await this.showAlert('Aucun conducteur disponible', 'Veuillez réessayer plus tard : Dans 15 minutes .');
  //   }
  // }

  async notifyDriversAndWaitForResponse(
      coordOrigine: { lat: number; lng: number } | null,
      coordDestination: { lat: number; lng: number } | null,
      requestRef: DocumentReference<DocumentData, DocumentData>,
      driversNotified: string[]
  ) {
    console.log('Conducteurs notifiés:', driversNotified);

    // ✅ Ouvre une seule bannière d’attente
    const waitingModal = await this.modalController.create({
      component: DriversModalComponentPage, // ton composant d’attente
      componentProps: { waitTime: 120 }, // 2 minutes
      cssClass: 'waiting-modal'
    });
    await waitingModal.present();

    let totalWaitTime = 120000; // 2 minutes
    let response = null;

    try {
      // ✅ Premier essai (2 minutes)
      response = await this.searchDriverService.waitForDriverResponse(
          driversNotified,
          requestRef,
          totalWaitTime,
          () => console.log("Première attente terminée")
      );

      // ✅ Si aucun conducteur n’a répondu, prolonger une fois (2 min de plus)
      if (!response || !response.accepted) {
        console.log("Aucun chauffeur après 2 minutes, on prolonge encore 2 minutes...");
        totalWaitTime += 120000;
        response = await this.searchDriverService.waitForDriverResponse(
            driversNotified,
            requestRef,
            totalWaitTime,
            () => console.log("Deuxième tentative terminée")
        );
      }

      await waitingModal.dismiss();

      if (response && response.accepted) {
        console.log('✅ Conducteur a accepté:', response.driverId);
        await this.showAlert('Course acceptée', 'Le conducteur a accepté votre demande.');
      } else {
        console.log('❌ Aucun conducteur n’a répondu.');
        await this.showAlert(
            'Aucun conducteur disponible',
            'Veuillez réessayer plus tard.'
        );
      }

    } catch (error) {
      console.error('Erreur lors de la notification des conducteurs:', error);
      await waitingModal.dismiss();
      await this.showAlert(
          'Temps écoulé',
          'Aucun conducteur n’a répondu dans le délai imparti.'
      );
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



  goToSubscribe() {
    this.navCtrl.navigateForward('/tabs/tab4'); // Redirect to home page or wherever appropriate
  }




  confirmerTrajet() {
    if (!this.origin || !this.destination) {
      this.showAlert('Veuillez sélectionner un départ et une destination.', 'test');
      return;
    }

    console.log('✅ Trajet confirmé :', {
      origin: this.origin,
      destination: this.destination,
    });
  }
  // ngAfterViewInit() {
  //   const auth = getAuth();
  //
  //   // Ensure the element is correctly referenced
  //   const container = this.recaptchaContainer.nativeElement as HTMLElement;
  //   const parameters = {
  //     size: 'invisible',
  //     callback: (response: any) => {
  //       console.log('reCAPTCHA solved:', response);
  //     },
  //     'expired-callback': () => {
  //       console.log('reCAPTCHA expired, please solve again.');
  //     }
  //   };
  //
  //   this.recaptchaVerifier = new RecaptchaVerifier(auth, container, parameters);
  //
  //   this.recaptchaVerifier.render().catch((error) => {
  //     console.error('Error rendering reCAPTCHA:', error);
  //   });
  // }
  //
  departure: any;

}
