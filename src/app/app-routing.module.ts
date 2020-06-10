import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoadingComponent } from './components/loading/loading.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CollectionComponent } from './components/collection/collection.component';
import { InformationComponent } from './components/information/information.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/loading',
        pathMatch: 'full'
    },
    {
        path: 'loading',
        component: LoadingComponent
    },
    {
        path: 'welcome',
        component: WelcomeComponent
    },
    {
        path: 'collection',
        component: CollectionComponent
    },
    {
        path: 'settings',
        component: SettingsComponent
    },
    {
        path: 'information',
        component: InformationComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
