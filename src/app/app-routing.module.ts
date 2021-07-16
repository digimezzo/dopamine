import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionComponent } from './components/collection/collection.component';
import { InformationComponent } from './components/information/information.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ManageCollectionComponent } from './components/manage-collection/manage-collection.component';
import { NowPlayingComponent } from './components/now-playing/now-playing.component';
import { SettingsComponent } from './components/settings/settings.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/loading',
        pathMatch: 'full',
    },
    {
        path: 'loading',
        component: LoadingComponent,
    },
    {
        path: 'welcome',
        component: WelcomeComponent,
    },
    {
        path: 'collection',
        component: CollectionComponent,
    },
    {
        path: 'nowplaying',
        component: NowPlayingComponent,
    },
    {
        path: 'managecollection',
        component: ManageCollectionComponent,
    },
    {
        path: 'settings',
        component: SettingsComponent,
    },
    {
        path: 'information',
        component: InformationComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
