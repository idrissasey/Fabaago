import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchridePage } from './searchride.page';

const routes: Routes = [
  {
    path: '',
    component: SearchridePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchridePageRoutingModule {}
