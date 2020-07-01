import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './services/electron.service';
import { AppearanceService } from './services/appearance/appearance.service';
import { IndexingService } from './services/indexing/indexing.service';
import { TranslatorService } from './services/translator/translator.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { MainComponent } from './components/main/main.component';
import { WindowControlsComponent } from './components/window-controls/window-controls.component';
import { LogoFullComponent } from './components/logo-full/logo-full.component';
import { ColorSchemeSwitcherComponent } from './components/color-scheme-switcher/color-scheme-switcher.component';
import { StepIndicatorComponent } from './components/step-indicator/step-indicator.component';

import { MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatSlideToggleModule, MatTooltipModule, MatSnackBarModule, MatRippleModule } from '@angular/material';
import { MatStepperModule } from '@angular/material/stepper';

import { TrackRepository } from './data/entities/track-repository';

import { Settings } from './core/settings';
import { Logger } from './core/logger';
import { AppearanceServiceBase } from './services/appearance/appearance-service-base';
import { TranslatorServiceBase } from './services/translator/translator-service-base';
import { IndexingServiceBase } from './services/indexing/indexing-service-base';
import { UpdateServiceBase } from './services/update/update-service-base';
import { UpdateService } from './services/update/update.service';
import { SnackbarServiceBase } from './services/snack-bar/snack-bar-service-base';
import { SnackBarService } from './services/snack-bar/snack-bar.service';
import { AddFolderComponent } from './components/add-folder/add-folder.component';
import { Desktop } from './core/desktop';
import { FolderServiceBase } from './services/folder/folder-service-base';
import { FolderService } from './services/folder/folder.service';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    WebviewDirective,
    WelcomeComponent,
    MainComponent,
    WindowControlsComponent,
    LogoFullComponent,
    StepIndicatorComponent,
    ColorSchemeSwitcherComponent,
    AddFolderComponent
  ],
  imports: [
    MatProgressSpinnerModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatRippleModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    ElectronService,
    Desktop,
    { provide: AppearanceServiceBase, useClass: AppearanceService },
    { provide: FolderServiceBase, useClass: FolderService },
    { provide: IndexingServiceBase, useClass: IndexingService },
    { provide: TranslatorServiceBase, useClass: TranslatorService },
    { provide: UpdateServiceBase, useClass: UpdateService },
    { provide: SnackbarServiceBase, useClass: SnackBarService },
    Settings,
    Logger,
    TrackRepository
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
