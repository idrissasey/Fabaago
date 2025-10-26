import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InscriptionPage } from './inscription.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { InscriptionPageRoutingModule } from './inscription-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    InscriptionPageRoutingModule
  ],
  declarations: [InscriptionPage] // Déclarez Inscription ici
})
export class InscriptionPageModule {}
