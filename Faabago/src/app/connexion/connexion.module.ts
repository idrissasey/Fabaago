import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConnexionPage } from './connexion.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ConnexionPageRoutingModule } from './connexion-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ConnexionPageRoutingModule
  ],
  declarations: [ConnexionPage]
})
export class ConnexionPageModule {}
