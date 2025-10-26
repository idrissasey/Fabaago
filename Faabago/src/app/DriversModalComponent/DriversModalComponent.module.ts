import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DriversModalComponentPage } from './DriversModalComponent.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { DriversModalComponentPageRoutingModule } from './DriversModalComponent-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    DriversModalComponentPageRoutingModule
  ],
  declarations: [DriversModalComponentPage]
})
export class Tab1PageModule {}
