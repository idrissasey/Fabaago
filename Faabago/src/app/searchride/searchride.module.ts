import { IonicModule } from '@ionic/angular';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchridePage } from './searchride.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { SearchridePageRoutingModule } from './searchride-routing.module';
import {SearchDriverService} from "../services/search-driver.service";
import {Firestore} from "@angular/fire/firestore";
import {MapPickerComponent} from "../components/map-picker/map-picker.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    SearchridePageRoutingModule,
    MapPickerComponent
  ],
  exports: [
    SearchridePage
  ],
  //providers: [SearchDriverService, Firestore], // 👈 Add this line
  declarations: [SearchridePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // 👈 Ajoute cette ligne
})
export class SearchridePageModule {}
