import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
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

import { MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatSlideToggleModule, MatTooltipModule, MatSnackBarModule, MatRippleModule, MatDialogModule } from '@angular/material';
import { MatStepperModule } from '@angular/material/stepper';

import { Settings } from './core/settings/settings';
import { Logger } from './core/logger';
import { BaseAppearanceService } from './services/appearance/base-appearance.service';
import { BaseTranslatorService } from './services/translator/base-translator.service';
import { BaseIndexingService } from './services/indexing/base-indexing.service';
import { BaseUpdateService } from './services/update/base-update.service';
import { UpdateService } from './services/update/update.service';
import { BaseSnackbarService } from './services/snack-bar/base-snack-bar.service';
import { SnackBarService } from './services/snack-bar/snack-bar.service';
import { AddFolderComponent } from './components/add-folder/add-folder.component';
import { Desktop } from './core/io/desktop';
import { BaseFolderService } from './services/folder/base-folder.service';
import { FolderService } from './services/folder/folder.service';
import { DialogHeaderComponent } from './components/dialogs/dialog-header/dialog-header.component';
import { ConfirmationDialogComponent } from './components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from './components/dialogs/error-dialog/error-dialog.component';

import { GlobalErrorHandler } from './globalErrorHandler';
import { DialogService } from './services/dialog/dialog.service';
import { BaseDialogService } from './services/dialog/base-dialog.service';
import { DatabaseFactory } from './data/database-factory';
import { FileSystem } from './core/io/file-system';
import { FolderRepository } from './data/repositories/folder-repository';
import { DatabaseMigrator } from './data/database-migrator';
import { BaseFolderRepository } from './data/repositories/base-folder-repository';
import { LoadingComponent } from './components/loading/loading.component';
import { BaseDatabaseMigrator } from './data/base-database-migrator';
import { BaseSettings } from './core/settings/base-settings';
import { BaseTrackRepository } from './data/repositories/base-track-repository';
import { TrackRepository } from './data/repositories/track-repository';

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
    AddFolderComponent,
    DialogHeaderComponent,
    ConfirmationDialogComponent,
    ErrorDialogComponent,
    LoadingComponent
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
    MatDialogModule,
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
    DatabaseFactory,
    FileSystem,
    Settings,
    { provide: BaseSettings, useClass: Settings },
    { provide: BaseDatabaseMigrator, useClass: DatabaseMigrator },
    { provide: BaseFolderRepository, useClass: FolderRepository },
    { provide: BaseTrackRepository, useClass: TrackRepository },
    { provide: BaseAppearanceService, useClass: AppearanceService },
    { provide: BaseFolderService, useClass: FolderService },
    { provide: BaseIndexingService, useClass: IndexingService },
    { provide: BaseTranslatorService, useClass: TranslatorService },
    { provide: BaseUpdateService, useClass: UpdateService },
    { provide: BaseSnackbarService, useClass: SnackBarService },
    { provide: BaseDialogService, useClass: DialogService },
    Logger,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmationDialogComponent, ErrorDialogComponent
  ],
})
export class AppModule { }
