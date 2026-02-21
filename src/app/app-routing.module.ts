import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionComponent } from './ui/components/collection/collection.component';
import { InformationComponent } from './ui/components/information/information.component';
import { LoadingComponent } from './ui/components/loading/loading.component';
import { ManageCollectionComponent } from './ui/components/manage-collection/manage-collection.component';
import { NowPlayingComponent } from './ui/components/now-playing/now-playing.component';
import { SettingsComponent } from './ui/components/settings/settings.component';
import { WelcomeComponent } from './ui/components/welcome/welcome.component';
import { CoverPlayerComponent } from './ui/components/mini-players/cover-player/cover-player.component';
import { HighlightsComponent } from './ui/components/highlights/highlights.component';

const routes: Routes = [
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
        path: 'coverplayer',
        component: CoverPlayerComponent,
    },
    {
        path: 'nowplaying',
        component: NowPlayingComponent,
    },
    {
        path: 'highlights',
        component: HighlightsComponent,
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
