import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriversModalComponentPage } from './DriversModalComponent.page';

const routes: Routes = [
  {
    path: '',
    component: DriversModalComponentPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriversModalComponentPageRoutingModule {}
