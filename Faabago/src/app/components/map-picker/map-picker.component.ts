import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewEncapsulation,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-map-picker',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './map-picker.component.html',
  styleUrls: ['./map-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MapPickerComponent implements OnInit, AfterViewInit {
  @Output() originSelected = new EventEmitter<{ lat: number; lng: number }>();
  @Output() destinationSelected = new EventEmitter<{ lat: number; lng: number }>();

  origin: { lat: number; lng: number } | null = null;
  destination: { lat: number; lng: number } | null = null;

  map!: google.maps.Map;
  private clickCount = 0;
  private originMarker?: any;
  private destinationMarker?: any;
  private polyline?: google.maps.Polyline;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  async initializeMap() {
    await customElements.whenDefined('gmp-map');
    const gmpMap = document.querySelector('gmp-map') as any;
    if (!gmpMap) return;

    this.map = gmpMap.innerMap;

    const placePicker = document.getElementById('place-picker') as any;

    // ✅ Gestion des clics sur la carte
    this.map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      this.handlePointSelection(pos);
    });

    // ✅ Gestion de la recherche via place-picker
    placePicker.addEventListener('gmpx-placechange', () => {
      const place = placePicker.value;
      if (!place?.location) return;

      const pos = {
        lat: place.location.lat(),
        lng: place.location.lng()
      };

      this.map.setCenter(pos);
      this.map.setZoom(17);
      this.handlePointSelection(pos);
    });
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  /** ✅ Nouvelle logique centralisée */
  private handlePointSelection(pos: { lat: number; lng: number }) {
    if (this.clickCount === 0) {
      this.setOrigin(pos);
      this.clickCount = 1;
    } else if (this.clickCount === 1) {
      this.setDestination(pos);
      this.clickCount = 2;
    } else {
      this.clearSelection();
      this.setOrigin(pos);
      this.clickCount = 1;
    }
  }

  /** 📍 Définit la position actuelle comme origine */
  setCurrentLocationAsOrigin() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
        (pos) => {
          const current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          this.setOrigin(current);
          this.map.setCenter(current);
          this.clickCount = 1;
        },
        (err) => console.error('Erreur géolocalisation:', err)
    );
  }

  setOrigin(pos: { lat: number; lng: number }) {
    this.origin = pos;
    this.originSelected.emit(pos);
    this.addMarker(pos, 'A', true);
    this.drawRouteIfReady();
  }

  setDestination(pos: { lat: number; lng: number }) {
    this.destination = pos;
    this.destinationSelected.emit(pos);
    this.addMarker(pos, 'B', false);
    this.drawRouteIfReady();
  }

  private drawRouteIfReady() {
    if (this.origin && this.destination) this.drawRoute();
  }

  addMarker(pos: { lat: number; lng: number }, label: string, isOrigin: boolean) {
    const markerEl = document.createElement('gmp-advanced-marker') as any;
    markerEl.position = pos;
    markerEl.title = label;
    markerEl.map = this.map;

    if (isOrigin) {
      if (this.originMarker) this.originMarker.remove();
      this.originMarker = markerEl;
    } else {
      if (this.destinationMarker) this.destinationMarker.remove();
      this.destinationMarker = markerEl;
    }
  }

  drawRoute() {
    if (!this.origin || !this.destination) return;
    if (this.polyline) this.polyline.setMap(null);

    this.polyline = new google.maps.Polyline({
      path: [this.origin, this.destination],
      strokeColor: '#3880ff',
      strokeOpacity: 1.0,
      strokeWeight: 4,
      map: this.map
    });
  }

  clearSelection() {
    this.origin = null;
    this.destination = null;
    this.clickCount = 0;
    if (this.originMarker) this.originMarker.remove();
    if (this.destinationMarker) this.destinationMarker.remove();
    if (this.polyline) this.polyline.setMap(null);
  }

  formatCoordinate(value: number | undefined): string {
    return value !== undefined ? value.toFixed(5) : '';
  }
}
