import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards_/auth.guard';
import { CustomPreloadingStrategy } from './guards_/custom-preloading-strategies';
import { CustomPermissionGuard } from './guards_/custom-permission.guard';

const routes: Routes = [
    {
        path: 'auth',
        loadChildren: './modules_/auth/auth.module#AuthModule',
        data: { preload: false, delay: false },
    },
    // {
    //     path: 'services',
    //     loadChildren: './modules_/catalog-services/catalog-services.module#CatalogServicesModule',
    //     canActivate: [AuthGuard],
    //     data: { preload: false, delay: false  },
    // },
    {
        path: 'dashboard',
        loadChildren: './modules_/dashboard/dashboard.module#DashboardModule',
        canActivate: [AuthGuard],
        data: { preload: true, delay: false , rolesPerm: ['Incident', 'Event', 'Performance', 'Delivery'] },
    },
    { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: CustomPreloadingStrategy })],
    exports: [RouterModule],
    declarations: [],
    providers: [CustomPreloadingStrategy]
})

export class AppRoutingModule { }
