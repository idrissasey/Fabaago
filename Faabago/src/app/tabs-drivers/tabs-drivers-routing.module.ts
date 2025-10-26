import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsDriversPage } from './tabs-drivers.page';

const routes: Routes = [
    {
        path: '',
        component: TabsDriversPage,
        children: [
            {
                path: 'tab2',
                loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
            },
            {
                path: 'searchride',
                loadChildren: () => import('../searchride/searchride.module').then(m => m.SearchridePageModule)
            },
            {
                path: '',
                redirectTo: 'tab2',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/tabs-drivers/tab2'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsDriversPageRoutingModule {}
