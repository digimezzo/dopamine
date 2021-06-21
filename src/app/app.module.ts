import { ScrollingModule } from '@angular/cdk/scrolling';
import { LOCATION_INITIALIZED } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, Injector, NgModule } from '@angular/core';
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
    MAT_TOOLTIP_DEFAULT_OPTIONS,
} from '@angular/material';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserModule, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularSplitModule } from 'angular-split';
import 'reflect-metadata';
import '../polyfills';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GitHubApi } from './common/api/git-hub/git-hub-api';
import { LastfmApi } from './common/api/lastfm/lastfm-api';
import { AlbumKeyGenerator } from './common/data/album-key-generator';
import { BaseDatabaseMigrator } from './common/data/base-database-migrator';
import { DatabaseFactory } from './common/data/database-factory';
import { DatabaseMigrator } from './common/data/database-migrator';
import { AlbumArtworkRepository } from './common/data/repositories/album-artwork-repository';
import { BaseAlbumArtworkRepository } from './common/data/repositories/base-album-artwork-repository';
import { BaseFolderRepository } from './common/data/repositories/base-folder-repository';
import { BaseFolderTrackRepository } from './common/data/repositories/base-folder-track-repository';
import { BaseRemovedTrackRepository } from './common/data/repositories/base-removed-track-repository';
import { BaseTrackRepository } from './common/data/repositories/base-track-repository';
import { FolderRepository } from './common/data/repositories/folder-repository';
import { FolderTrackRepository } from './common/data/repositories/folder-track-repository';
import { RemovedTrackRepository } from './common/data/repositories/removed-track-repository';
import { TrackRepository } from './common/data/repositories/track-repository';
import { Hacks } from './common/hacks';
import { ImageProcessor } from './common/image-processor';
import { BaseRemoteProxy } from './common/io/base-remote-proxy';
import { Desktop } from './common/io/desktop';
import { FileSystem } from './common/io/file-system';
import { RemoteProxy } from './common/io/remote-proxy';
import { ListRandomizer } from './common/list-randomizer';
import { Logger } from './common/logger';
import { MathExtensions } from './common/math-extensions';
import { FileMetadataFactory } from './common/metadata/file-metadata-factory';
import { MetadataPatcher } from './common/metadata/metadata-patcher';
import { MimeTypes } from './common/metadata/mime-types';
import { NativeElementProxy } from './common/native-element-proxy';
import { PathValidator } from './common/path-validator';
import { BaseScheduler } from './common/scheduler/base-scheduler';
import { Scheduler } from './common/scheduler/scheduler';
import { BaseSettings } from './common/settings/base-settings';
import { Settings } from './common/settings/settings';
import { TrackOrdering } from './common/track-ordering';
import { AddFolderComponent } from './components/add-folder/add-folder.component';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { AlbumBrowserComponent } from './components/collection/album-browser/album-browser.component';
import { AlbumRowsGetter } from './components/collection/album-browser/album-rows-getter';
import { AlbumSpaceCalculator } from './components/collection/album-browser/album-space-calculator';
import { AlbumComponent } from './components/collection/album-browser/album/album.component';
import { CollectionAlbumsComponent } from './components/collection/collection-albums/collection-albums.component';
import { CollectionArtistsComponent } from './components/collection/collection-artists/collection-artists.component';
import { CollectionFoldersComponent } from './components/collection/collection-folders/collection-folders.component';
import { FoldersPersister } from './components/collection/collection-folders/folders-persister';
import { CollectionGenresComponent } from './components/collection/collection-genres/collection-genres.component';
import { GenreBrowserComponent } from './components/collection/collection-genres/genre-browser/genre-browser.component';
import { GenreComponent } from './components/collection/collection-genres/genre/genre.component';
import { CollectionPersister } from './components/collection/collection-persister';
import { CollectionPlaybackPaneComponent } from './components/collection/collection-playback-pane/collection-playback-pane.component';
import { CollectionPlaylistsComponent } from './components/collection/collection-playlists/collection-playlists.component';
import { CollectionTracksComponent } from './components/collection/collection-tracks/collection-tracks.component';
import { CollectionComponent } from './components/collection/collection.component';
import { TotalsComponent } from './components/collection/totals/totals.component';
import { TrackBrowserComponent } from './components/collection/track-browser/track-browser.component';
import { TrackComponent } from './components/collection/track/track.component';
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
import { OnlineSettingsComponent } from './components/settings/online-settings/online-settings.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';
import { StepIndicatorComponent } from './components/step-indicator/step-indicator.component';
import { VolumeControlComponent } from './components/volume-control/volume-control.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { WindowControlsComponent } from './components/window-controls/window-controls.component';
import { CdkVirtualScrollViewportPatchDirective } from './directives/cdk-virtual-scroll-viewport-patch-directive';
import { WebviewDirective } from './directives/webview.directive';
import { GlobalErrorHandler } from './globalErrorHandler';
import { AlphabeticalHeaderPipe } from './pipes/alphabetical-header.pipe';
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
import { ApplicationService } from './services/application/application.service';
import { BaseApplicationService } from './services/application/base-application.service';
import { BaseDialogService } from './services/dialog/base-dialog.service';
import { DialogService } from './services/dialog/dialog.service';
import { BaseDiscordService } from './services/discord/base-discord.service';
import { DiscordService } from './services/discord/discord.service';
import { ElectronService } from './services/electron.service';
import { BaseFolderService } from './services/folder/base-folder.service';
import { FolderService } from './services/folder/folder.service';
import { BaseGenreService } from './services/genre/base-genre.service';
import { GenreService } from './services/genre/genre.service';
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

export function appInitializerFactory(translate: TranslateService, injector: Injector): () => Promise<any> {
    return () =>
        new Promise<any>((resolve: any) => {
            const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(undefined));
            locationInitialized.then(() => {
                const languageToSet: string = 'en';
                translate.setDefaultLang(languageToSet);
                translate.use(languageToSet).subscribe(
                    () => {},
                    (err) => {},
                    () => {
                        resolve(undefined);
                    }
                );
            });
        });
}

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
        OnlineSettingsComponent,
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
        AlphabeticalHeaderPipe,
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
        GenreComponent,
        TotalsComponent,
        PlaybackIndicatorComponent,
        AlbumComponent,
        GenreBrowserComponent,
        AlbumBrowserComponent,
        TrackBrowserComponent,
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
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [TranslateService, Injector],
            multi: true,
        },
        ElectronService,
        Desktop,
        DatabaseFactory,
        FileSystem,
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
        CollectionPersister,
        FoldersPersister,
        PathValidator,
        AlbumRowsGetter,
        AlbumSpaceCalculator,
        NativeElementProxy,
        GitHubApi,
        MetadataPatcher,
        TrackOrdering,
        { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: CustomTooltipDefaults },
        { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
        { provide: BaseAlbumArtworkRepository, useClass: AlbumArtworkRepository },
        { provide: BaseApplicationService, useClass: ApplicationService },
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
        { provide: BaseGenreService, useClass: GenreService },
        { provide: BaseTrackService, useClass: TrackService },
        { provide: BaseAlbumService, useClass: AlbumService },
        { provide: BaseDiscordService, useClass: DiscordService },
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
