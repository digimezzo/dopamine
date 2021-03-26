import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    GestureConfig,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipDefaultOptions,
    MatTooltipModule,
    MAT_TOOLTIP_DEFAULT_OPTIONS
} from '@angular/material';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserModule, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularSplitModule } from 'angular-split';
import 'reflect-metadata';
import '../polyfills';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddFolderComponent } from './components/add-folder/add-folder.component';
import { AlbumComponent } from './components/album/album.component';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { AlbumSpaceCalculator } from './components/collection/album-space-calculator';
import { AlbumsPersister } from './components/collection/collection-albums/albums-persister';
import { CollectionAlbumsComponent } from './components/collection/collection-albums/collection-albums.component';
import { CollectionArtistsComponent } from './components/collection/collection-artists/collection-artists.component';
import { CollectionFoldersComponent } from './components/collection/collection-folders/collection-folders.component';
import { FoldersPersister } from './components/collection/collection-folders/folders-persister';
import { CollectionGenresComponent } from './components/collection/collection-genres/collection-genres.component';
import { CollectionPlaybackPaneComponent } from './components/collection/collection-playback-pane/collection-playback-pane.component';
import { CollectionPlaylistsComponent } from './components/collection/collection-playlists/collection-playlists.component';
import { CollectionTracksComponent } from './components/collection/collection-tracks/collection-tracks.component';
import { CollectionComponent } from './components/collection/collection.component';
import { ColorSchemeSwitcherComponent } from './components/color-scheme-switcher/color-scheme-switcher.component';
import { ConfirmationDialogComponent } from './components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DialogHeaderComponent } from './components/dialogs/dialog-header/dialog-header.component';
import { ErrorDialogComponent } from './components/dialogs/error-dialog/error-dialog.component';
import { LicenseDialogComponent } from './components/dialogs/license-dialog/license-dialog.component';
import { AboutComponent } from './components/information/about/about.component';
import { ComponentsComponent } from './components/information/components/components.component';
import { InformationComponent } from './components/information/information.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LogoFullComponent } from './components/logo-full/logo-full.component';
import { LogoSmallComponent } from './components/logo-small/logo-small.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { ManageAlbumCoversComponent } from './components/manage-collection/manage-album-covers/manage-album-covers.component';
import { ManageCollectionComponent } from './components/manage-collection/manage-collection.component';
import { ManageMusicComponent } from './components/manage-collection/manage-music/manage-music.component';
import { ManageRefreshComponent } from './components/manage-collection/manage-refresh/manage-refresh.component';
import { PlaybackControlsComponent } from './components/playback-controls/playback-controls.component';
import { PlaybackCoverArtComponent } from './components/playback-cover-art/playback-cover-art.component';
import { PlaybackIndicatorComponent } from './components/playback-indicator/playback-indicator.component';
import { PlaybackInformationComponent } from './components/playback-information/playback-information.component';
import { PlaybackProgressComponent } from './components/playback-progress/playback-progress.component';
import { PlaybackTimeComponent } from './components/playback-time/playback-time.component';
import { AdvancedSettingsComponent } from './components/settings/advanced-settings/advanced-settings.component';
import { AppearanceSettingsComponent } from './components/settings/appearance-settings/appearance-settings.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';
import { StepIndicatorComponent } from './components/step-indicator/step-indicator.component';
import { TotalsComponent } from './components/totals/totals.component';
import { TrackComponent } from './components/track/track.component';
import { VolumeControlComponent } from './components/volume-control/volume-control.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { WindowControlsComponent } from './components/window-controls/window-controls.component';
import { LastfmApi } from './core/api/lastfm/lastfm-api';
import { Hacks } from './core/hacks';
import { ImageProcessor } from './core/image-processor';
import { BaseRemoteProxy } from './core/io/base-remote-proxy';
import { Desktop } from './core/io/desktop';
import { FileSystem } from './core/io/file-system';
import { RemoteProxy } from './core/io/remote-proxy';
import { ListRandomizer } from './core/list-randomizer';
import { Logger } from './core/logger';
import { MathExtensions } from './core/math-extensions';
import { PathValidator } from './core/path-validator';
import { BaseScheduler } from './core/scheduler/base-scheduler';
import { Scheduler } from './core/scheduler/scheduler';
import { BaseSettings } from './core/settings/base-settings';
import { Settings } from './core/settings/settings';
import { AlbumKeyGenerator } from './data/album-key-generator';
import { BaseDatabaseMigrator } from './data/base-database-migrator';
import { DatabaseFactory } from './data/database-factory';
import { DatabaseMigrator } from './data/database-migrator';
import { AlbumArtworkRepository } from './data/repositories/album-artwork-repository';
import { BaseAlbumArtworkRepository } from './data/repositories/base-album-artwork-repository';
import { BaseFolderRepository } from './data/repositories/base-folder-repository';
import { BaseFolderTrackRepository } from './data/repositories/base-folder-track-repository';
import { BaseRemovedTrackRepository } from './data/repositories/base-removed-track-repository';
import { BaseTrackRepository } from './data/repositories/base-track-repository';
import { FolderRepository } from './data/repositories/folder-repository';
import { FolderTrackRepository } from './data/repositories/folder-track-repository';
import { RemovedTrackRepository } from './data/repositories/removed-track-repository';
import { TrackRepository } from './data/repositories/track-repository';
import { CdkVirtualScrollViewportPatchDirective } from './directives/cdk-virtual-scroll-viewport-patch-directive';
import { WebviewDirective } from './directives/webview.directive';
import { GlobalErrorHandler } from './globalErrorHandler';
import { FileMetadataFactory } from './metadata/file-metadata-factory';
import { MimeTypes } from './metadata/mime-types';
import { FolderNamePipe } from './pipes/folder-name.pipe';
import { FormatPlaybackTimePipe } from './pipes/format-playback-time';
import { FormatTotalDurationPipe } from './pipes/format-total-duration.pipe';
import { FormatTotalFileSizePipe } from './pipes/format-total-file-size.pipe';
import { FormatTrackArtistsPipe } from './pipes/format-track-artists.pipe';
import { FormatTrackDurationPipe } from './pipes/format-track-duration.pipe';
import { FormatTrackNumberPipe } from './pipes/format-track-number.pipe';
import { FormatTrackTitlePipe } from './pipes/format-track-title.pipe';
import { SubfolderNamePipe } from './pipes/subfolder-name.pipe';
import { AlbumArtworkCacheIdFactory } from './services/album-artwork-cache/album-artwork-cache-id-factory';
import { AlbumArtworkCacheService } from './services/album-artwork-cache/album-artwork-cache.service';
import { BaseAlbumArtworkCacheService } from './services/album-artwork-cache/base-album-artwork-cache.service';
import { AlbumService } from './services/album/album-service';
import { BaseAlbumService } from './services/album/base-album-service';
import { AppearanceService } from './services/appearance/appearance.service';
import { BaseAppearanceService } from './services/appearance/base-appearance.service';
import { BaseDialogService } from './services/dialog/base-dialog.service';
import { DialogService } from './services/dialog/dialog.service';
import { ElectronService } from './services/electron.service';
import { BaseFolderService } from './services/folder/base-folder.service';
import { FolderService } from './services/folder/folder.service';
import { AlbumArtworkAdder } from './services/indexing/album-artwork-adder';
import { AlbumArtworkGetter } from './services/indexing/album-artwork-getter';
import { AlbumArtworkIndexer } from './services/indexing/album-artwork-indexer';
import { AlbumArtworkRemover } from './services/indexing/album-artwork-remover';
import { BaseCollectionChecker } from './services/indexing/base-collection-checker';
import { BaseIndexablePathFetcher } from './services/indexing/base-indexable-path-fetcher';
import { BaseIndexingService } from './services/indexing/base-indexing.service';
import { CollectionChecker } from './services/indexing/collection-checker';
import { DirectoryWalker } from './services/indexing/directory-walker';
import { EmbeddedAlbumArtworkGetter } from './services/indexing/embedded-album-artwork-getter';
import { ExternalAlbumArtworkGetter } from './services/indexing/external-album-artwork-getter';
import { ExternalArtworkPathGetter } from './services/indexing/external-artwork-path-getter';
import { IndexablePathFetcher } from './services/indexing/indexable-path-fetcher';
import { IndexingService } from './services/indexing/indexing.service';
import { OnlineAlbumArtworkGetter } from './services/indexing/online-album-artwork-getter';
import { TrackAdder } from './services/indexing/track-adder';
import { TrackFieldCreator } from './services/indexing/track-field-creator';
import { TrackFiller } from './services/indexing/track-filler';
import { TrackIndexer } from './services/indexing/track-indexer';
import { TrackRemover } from './services/indexing/track-remover';
import { TrackUpdater } from './services/indexing/track-updater';
import { TrackVerifier } from './services/indexing/track-verifier';
import { BaseNavigationService } from './services/navigation/base-navigation.service';
import { NavigationService } from './services/navigation/navigation.service';
import { BasePlaybackIndicationService } from './services/playback-indication/base-playback-indication.service';
import { PlaybackIndicationService } from './services/playback-indication/playback-indication.service';
import { AudioPlayer } from './services/playback/audio-player';
import { BaseAudioPlayer } from './services/playback/base-audio-player';
import { BasePlaybackService } from './services/playback/base-playback.service';
import { PlaybackService } from './services/playback/playback.service';
import { ProgressUpdater } from './services/playback/progress-updater';
import { Queue } from './services/playback/queue';
import { BaseSnackBarService } from './services/snack-bar/base-snack-bar.service';
import { SnackBarService } from './services/snack-bar/snack-bar.service';
import { BaseTrackService } from './services/track/base-track.service';
import { TrackService } from './services/track/track.service';
import { BaseTranslatorService } from './services/translator/base-translator.service';
import { TranslatorService } from './services/translator/translator.service';
import { BaseUpdateService } from './services/update/base-update.service';
import { UpdateService } from './services/update/update.service';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/** Custom options the configure the tooltip's default show/hide delays. */
export const CustomTooltipDefaults: MatTooltipDefaultOptions = {
    showDelay: 500,
    hideDelay: 0,
    touchendHideDelay: 0,
};

@NgModule({
    declarations: [
        AppComponent,
        WebviewDirective,
        CdkVirtualScrollViewportPatchDirective,
        WelcomeComponent,
        CollectionComponent,
        WindowControlsComponent,
        LogoFullComponent,
        LogoSmallComponent,
        StepIndicatorComponent,
        ColorSchemeSwitcherComponent,
        AddFolderComponent,
        DialogHeaderComponent,
        ConfirmationDialogComponent,
        ErrorDialogComponent,
        LicenseDialogComponent,
        ManageCollectionComponent,
        ManageMusicComponent,
        ManageRefreshComponent,
        ManageAlbumCoversComponent,
        LoadingComponent,
        MainMenuComponent,
        BackButtonComponent,
        SettingsComponent,
        InformationComponent,
        AppearanceSettingsComponent,
        AdvancedSettingsComponent,
        AboutComponent,
        ComponentsComponent,
        SnackBarComponent,
        CollectionFoldersComponent,
        CollectionPlaybackPaneComponent,
        VolumeControlComponent,
        FolderNamePipe,
        SubfolderNamePipe,
        FormatTrackNumberPipe,
        FormatTrackArtistsPipe,
        FormatTrackTitlePipe,
        FormatTrackDurationPipe,
        FormatTotalDurationPipe,
        FormatTotalFileSizePipe,
        FormatPlaybackTimePipe,
        CollectionPlaylistsComponent,
        CollectionArtistsComponent,
        CollectionAlbumsComponent,
        CollectionTracksComponent,
        CollectionGenresComponent,
        PlaybackControlsComponent,
        PlaybackProgressComponent,
        PlaybackTimeComponent,
        PlaybackInformationComponent,
        PlaybackCoverArtComponent,
        TrackComponent,
        TotalsComponent,
        PlaybackIndicatorComponent,
        AlbumComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
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
        MatMenuModule,
        MatDividerModule,
        MatTabsModule,
        MatCheckboxModule,
        MatChipsModule,
        MatProgressBarModule,
        MatSliderModule,
        HammerModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        AngularSplitModule,
        ScrollingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
    providers: [
        ElectronService,
        Desktop,
        DatabaseFactory,
        FileSystem,
        Settings,
        TrackIndexer,
        DirectoryWalker,
        TrackRemover,
        TrackUpdater,
        TrackAdder,
        TrackVerifier,
        TrackFiller,
        FileMetadataFactory,
        TrackFieldCreator,
        AlbumKeyGenerator,
        MimeTypes,
        AlbumArtworkCacheIdFactory,
        ImageProcessor,
        AlbumArtworkGetter,
        ExternalAlbumArtworkGetter,
        EmbeddedAlbumArtworkGetter,
        OnlineAlbumArtworkGetter,
        AlbumArtworkIndexer,
        AlbumArtworkAdder,
        AlbumArtworkRemover,
        ExternalArtworkPathGetter,
        LastfmApi,
        Logger,
        Scheduler,
        Hacks,
        ListRandomizer,
        ProgressUpdater,
        Queue,
        MathExtensions,
        FormatTrackArtistsPipe,
        FormatTrackTitlePipe,
        AlbumsPersister,
        FoldersPersister,
        PathValidator,
        AlbumSpaceCalculator,
        { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: CustomTooltipDefaults },
        { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
        { provide: BaseAlbumArtworkRepository, useClass: AlbumArtworkRepository },
        { provide: BaseAlbumArtworkCacheService, useClass: AlbumArtworkCacheService },
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
        { provide: BaseNavigationService, useClass: NavigationService },
        { provide: BaseIndexingService, useClass: IndexingService },
        { provide: BaseTranslatorService, useClass: TranslatorService },
        { provide: BaseUpdateService, useClass: UpdateService },
        { provide: BaseSnackBarService, useClass: SnackBarService },
        { provide: BasePlaybackService, useClass: PlaybackService },
        { provide: BaseDialogService, useClass: DialogService },
        { provide: BaseTrackService, useClass: TrackService },
        { provide: BaseAlbumService, useClass: AlbumService },
        { provide: BasePlaybackIndicationService, useClass: PlaybackIndicationService },
        { provide: BaseScheduler, useClass: Scheduler },
        { provide: BaseRemoteProxy, useClass: RemoteProxy },
        { provide: BaseAudioPlayer, useClass: AudioPlayer },
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler,
        },
    ],
    bootstrap: [AppComponent],
    entryComponents: [ConfirmationDialogComponent, ErrorDialogComponent, LicenseDialogComponent, SnackBarComponent],
})
export class AppModule {}
