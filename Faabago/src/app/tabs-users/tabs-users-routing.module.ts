import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsUsersPage } from './tabs-users.page';

const routes: Routes = [
    {
        path: '',
        component: TabsUsersPage,
        children: [
            {
                path: 'tab1',
                loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
            },
            {
                path: 'searchride',
                loadChildren: () => import('../searchride/searchride.module').then(m => m.SearchridePageModule)
            },
            {
                path: '',
                redirectTo: 'tab1',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs-users/tab1',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/tabs-users/tab1'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsUsersPageRoutingModule {}
