import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatRippleModule, MatSelectModule, MatSlideToggleModule, MatSnackBarModule, MatTooltipModule } from '@angular/material';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import 'reflect-metadata';
import '../polyfills';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddFolderComponent } from './components/add-folder/add-folder.component';
import { ColorSchemeSwitcherComponent } from './components/color-scheme-switcher/color-scheme-switcher.component';
import { ConfirmationDialogComponent } from './components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DialogHeaderComponent } from './components/dialogs/dialog-header/dialog-header.component';
import { ErrorDialogComponent } from './components/dialogs/error-dialog/error-dialog.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LogoFullComponent } from './components/logo-full/logo-full.component';
import { MainComponent } from './components/main/main.component';
import { StepIndicatorComponent } from './components/step-indicator/step-indicator.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { WindowControlsComponent } from './components/window-controls/window-controls.component';
import { Desktop } from './core/io/desktop';
import { FileSystem } from './core/io/file-system';
import { Logger } from './core/logger';
import { BaseSettings } from './core/settings/base-settings';
import { Settings } from './core/settings/settings';
import { AlbumKeyGenerator } from './data/album-key-generator';
import { BaseDatabaseMigrator } from './data/base-database-migrator';
import { DataDelimiter } from './data/data-delimiter';
import { DatabaseFactory } from './data/database-factory';
import { DatabaseMigrator } from './data/database-migrator';
import { BaseFolderRepository } from './data/repositories/base-folder-repository';
import { BaseFolderTrackRepository } from './data/repositories/base-folder-track-repository';
import { BaseRemovedTrackRepository } from './data/repositories/base-removed-track-repository';
import { BaseTrackRepository } from './data/repositories/base-track-repository';
import { FolderRepository } from './data/repositories/folder-repository';
import { FolderTrackRepository } from './data/repositories/folder-track-repository';
import { RemovedTrackRepository } from './data/repositories/removed-track-repository';
import { TrackRepository } from './data/repositories/track-repository';
import { WebviewDirective } from './directives/webview.directive';
import { GlobalErrorHandler } from './globalErrorHandler';
import { FileMetadataFactory } from './metadata/file-metadata-factory';
import { MimeTypes } from './metadata/mime-types';
import { AppearanceService } from './services/appearance/appearance.service';
import { BaseAppearanceService } from './services/appearance/base-appearance.service';
import { BaseDialogService } from './services/dialog/base-dialog.service';
import { DialogService } from './services/dialog/dialog.service';
import { ElectronService } from './services/electron.service';
import { BaseFolderService } from './services/folder/base-folder.service';
import { FolderService } from './services/folder/folder.service';
import { BaseCollectionChecker } from './services/indexing/base-collection-checker';
import { BaseIndexablePathFetcher } from './services/indexing/base-indexable-path-fetcher';
import { BaseIndexingService } from './services/indexing/base-indexing.service';
import { CollectionChecker } from './services/indexing/collection-checker';
import { CollectionIndexer } from './services/indexing/collection-indexer';
import { DirectoryWalker } from './services/indexing/directory-walker';
import { IndexablePathFetcher } from './services/indexing/indexable-path-fetcher';
import { IndexingService } from './services/indexing/indexing.service';
import { TrackFieldCreator } from './services/indexing/track-field-creator';
import { TrackFiller } from './services/indexing/track-filler';
import { TrackRemover } from './services/indexing/track-remover';
import { TrackUpdater } from './services/indexing/track-updater';
import { BaseSnackbarService } from './services/snack-bar/base-snack-bar.service';
import { SnackBarService } from './services/snack-bar/snack-bar.service';
import { BaseTranslatorService } from './services/translator/base-translator.service';
import { TranslatorService } from './services/translator/translator.service';
import { BaseUpdateService } from './services/update/base-update.service';
import { UpdateService } from './services/update/update.service';

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
    CollectionIndexer,
    DirectoryWalker,
    TrackRemover,
    TrackUpdater,
    TrackFiller,
    FileMetadataFactory,
    TrackFieldCreator,
    DataDelimiter,
    AlbumKeyGenerator,
    MimeTypes,
    { provide: BaseCollectionChecker, useClass: CollectionChecker },
    { provide: BaseIndexablePathFetcher, useClass: IndexablePathFetcher },
    { provide: BaseSettings, useClass: Settings },
    { provide: BaseDatabaseMigrator, useClass: DatabaseMigrator },
    { provide: BaseFolderRepository, useClass: FolderRepository },
    { provide: BaseRemovedTrackRepository, useClass: RemovedTrackRepository },
    { provide: BaseTrackRepository, useClass: TrackRepository },
    { provide: BaseFolderTrackRepository, useClass: FolderTrackRepository },
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
