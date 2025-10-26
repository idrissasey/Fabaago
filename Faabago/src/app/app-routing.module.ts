import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {DriverDashboardComponent} from "./components/driver-dashboard/driver-dashboard.component";
import {UserDashboardComponent} from "./components/user-dashboard/user-dashboard.component";

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
  },  {
    path: 'tabs-users',
    loadChildren: () => import('./tabs-users/tabs-users.module').then(m => m.TabsUsersPageModule),
  }, {
    path: 'tabs-drivers',
    loadChildren: () => import('./tabs-drivers/tabs-drivers.module').then(m => m.TabsDriversPageModule),
  },
  { path: 'driver-dashboard', component: DriverDashboardComponent },
  { path: 'user-dashboard', component: UserDashboardComponent },
  // autres routes...
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
