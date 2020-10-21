import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoadingComponent } from './components/loading/loading.component';
import { CollectionComponent } from './components/collection/collection.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/collection',
        pathMatch: 'full'
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
        path: 'loading',
        component: LoadingComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})

export class AppRoutingModule { }
