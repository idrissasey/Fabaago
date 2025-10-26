import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsDriversPageRoutingModule } from './tabs-drivers-routing.module';

import { TabsDriversPage } from './tabs-drivers.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsDriversPageRoutingModule
  ],
  declarations: [TabsDriversPage]
})
export class TabsDriversPageModule {}
