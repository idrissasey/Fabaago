import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsUsersPageRoutingModule } from './tabs-users-routing.module';

import { TabsUsersPage } from './tabs-users.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsUsersPageRoutingModule
  ],
  declarations: [TabsUsersPage]
})
export class TabsUsersPageModule {}
