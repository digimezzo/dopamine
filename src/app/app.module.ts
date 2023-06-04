import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LOCATION_INITIALIZED } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, Injector, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatRippleModule } from '@angular/material/core';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyTooltipDefaultOptions as MatTooltipDefaultOptions, MatLegacyTooltipModule as MatTooltipModule, MAT_LEGACY_TOOLTIP_DEFAULT_OPTIONS as MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/legacy-tooltip';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
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
import { ContextMenuOpener } from './common/context-menu-opener';
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
import { DateTime } from './common/date-time';
import { FileValidator } from './common/file-validator';
import { Hacks } from './common/hacks';
import { ImageProcessor } from './common/image-processor';
import { Application } from './common/io/application';
import { BaseApplication } from './common/io/base-application';
import { BaseDesktop } from './common/io/base-desktop';
import { BaseFileAccess } from './common/io/base-file-access';
import { BaseIpcProxy } from './common/io/base-ipc-proxy';
import { BaseTranslateServiceProxy } from './common/io/base-translate-service-proxy';
import { DateProxy } from './common/io/date-proxy';
import { Desktop } from './common/io/desktop';
import { DocumentProxy } from './common/io/document-proxy';
import { FileAccess } from './common/io/file-access';
import { IpcProxy } from './common/io/ipc-proxy';
import { TranslateServiceProxy } from './common/io/translate-service-proxy';
import { Logger } from './common/logger';
import { MathExtensions } from './common/math-extensions';
import { BaseFileMetadataFactory } from './common/metadata/base-file-metadata-factory';
import { FileMetadataFactory } from './common/metadata/file-metadata-factory';
import { MetadataPatcher } from './common/metadata/metadata-patcher';
import { MimeTypes } from './common/metadata/mime-types';
import { NativeElementProxy } from './common/native-element-proxy';
import { ArtistOrdering } from './common/ordering/artist-ordering';
import { GenreOrdering } from './common/ordering/genre-ordering';
import { TrackOrdering } from './common/ordering/track-ordering';
import { PathValidator } from './common/path-validator';
import { BaseScheduler } from './common/scheduling/base-scheduler';
import { Scheduler } from './common/scheduling/scheduler';
import { SemanticZoomHeaderAdder } from './common/semantic-zoom-header-adder';
import { BaseSettings } from './common/settings/base-settings';
import { Settings } from './common/settings/settings';
import { Shuffler } from './common/shuffler';
import { TextSanitizer } from './common/text-sanitizer';
import { AddFolderComponent } from './components/add-folder/add-folder.component';
import { AddToPlaylistMenu } from './components/add-to-playlist-menu';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { AlbumBrowserComponent } from './components/collection/album-browser/album-browser.component';
import { AlbumRowsGetter } from './components/collection/album-browser/album-rows-getter';
import { AlbumComponent } from './components/collection/album-browser/album/album.component';
import { AlbumsAlbumsPersister } from './components/collection/collection-albums/albums-albums-persister';
import { AlbumsTracksPersister } from './components/collection/collection-albums/albums-tracks-persister';
import { CollectionAlbumsComponent } from './components/collection/collection-albums/collection-albums.component';
import { ArtistBrowserComponent } from './components/collection/collection-artists/artist-browser/artist-browser.component';
import { ArtistComponent } from './components/collection/collection-artists/artist/artist.component';
import { ArtistsAlbumsPersister } from './components/collection/collection-artists/artists-albums-persister';
import { ArtistsPersister } from './components/collection/collection-artists/artists-persister';
import { ArtistsTracksPersister } from './components/collection/collection-artists/artists-tracks-persister';
import { CollectionArtistsComponent } from './components/collection/collection-artists/collection-artists.component';
import { CollectionFoldersComponent } from './components/collection/collection-folders/collection-folders.component';
import { FoldersPersister } from './components/collection/collection-folders/folders-persister';
import { CollectionGenresComponent } from './components/collection/collection-genres/collection-genres.component';
import { GenreBrowserComponent } from './components/collection/collection-genres/genre-browser/genre-browser.component';
import { GenreComponent } from './components/collection/collection-genres/genre/genre.component';
import { GenresAlbumsPersister } from './components/collection/collection-genres/genres-albums-persister';
import { GenresPersister } from './components/collection/collection-genres/genres-persister';
import { GenresTracksPersister } from './components/collection/collection-genres/genres-tracks-persister';
import { CollectionPersister } from './components/collection/collection-persister';
import { CollectionPlaybackPaneComponent } from './components/collection/collection-playback-pane/collection-playback-pane.component';
import { CollectionPlaylistsComponent } from './components/collection/collection-playlists/collection-playlists.component';
import { PlaylistBrowserComponent } from './components/collection/collection-playlists/playlist-browser/playlist-browser.component';
import { PlaylistComponent } from './components/collection/collection-playlists/playlist-browser/playlist/playlist.component';
import { PlaylistFolderBrowserComponent } from './components/collection/collection-playlists/playlist-folder-browser/playlist-folder-browser.component';
import { PlaylistRowsGetter } from './components/collection/collection-playlists/playlist-folder-browser/playlist-rows-getter';
import { PlaylistFoldersPersister } from './components/collection/collection-playlists/playlist-folders-persister';
import { PlaylistTrackBrowserComponent } from './components/collection/collection-playlists/playlist-track-browser/playlist-track-browser.component';
import { PlaylistsPersister } from './components/collection/collection-playlists/playlists-persister';
import { PlaylistsTracksPersister } from './components/collection/collection-playlists/playlists-tracks-persister';
import { CollectionTracksTableHeaderComponent } from './components/collection/collection-tracks/collection-tracks-table/collection-tracks-table-header/collection-tracks-table-header.component';
import { CollectionTracksTableComponent } from './components/collection/collection-tracks/collection-tracks-table/collection-tracks-table.component';
import { CollectionTracksComponent } from './components/collection/collection-tracks/collection-tracks.component';
import { CollectionComponent } from './components/collection/collection.component';
import { ItemSpaceCalculator } from './components/collection/item-space-calculator';
import { SemanticZoomButtonComponent } from './components/collection/semantic-zoom/semantic-zoom-button/semantic-zoom-button.component';
import { SemanticZoomComponent } from './components/collection/semantic-zoom/semantic-zoom.component';
import { TabSelectionGetter } from './components/collection/tab-selection-getter';
import { TotalsComponent } from './components/collection/totals/totals.component';
import { TrackBrowserComponent } from './components/collection/track-browser/track-browser.component';
import { TrackComponent } from './components/collection/track/track.component';
import { ConfirmationDialogComponent } from './components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DialogHeaderComponent } from './components/dialogs/dialog-header/dialog-header.component';
import { EditColumnsDialogComponent } from './components/dialogs/edit-columns-dialog/edit-columns-dialog.component';
import { EditPlaylistDialogComponent } from './components/dialogs/edit-playlist-dialog/edit-playlist-dialog.component';
import { ErrorDialogComponent } from './components/dialogs/error-dialog/error-dialog.component';
import { InputDialogComponent } from './components/dialogs/input-dialog/input-dialog.component';
import { LicenseDialogComponent } from './components/dialogs/license-dialog/license-dialog.component';
import { AboutComponent } from './components/information/about/about.component';
import { ComponentsComponent } from './components/information/components/components.component';
import { InformationComponent } from './components/information/information.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LogoFullComponent } from './components/logo-full/logo-full.component';
import { LogoSmallComponent } from './components/logo-small/logo-small.component';
import { LoveComponent } from './components/love/love.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { ManageAlbumCoversComponent } from './components/manage-collection/manage-album-covers/manage-album-covers.component';
import { ManageCollectionComponent } from './components/manage-collection/manage-collection.component';
import { ManageMusicComponent } from './components/manage-collection/manage-music/manage-music.component';
import { ManageRefreshComponent } from './components/manage-collection/manage-refresh/manage-refresh.component';
import { NowPlayingPlaybackPaneComponent } from './components/now-playing/now-playing-playback-pane/now-playing-playback-pane.component';
import { NowPlayingComponent } from './components/now-playing/now-playing.component';
import { PlaybackControlsComponent } from './components/playback-controls/playback-controls.component';
import { PlaybackCoverArtComponent } from './components/playback-cover-art/playback-cover-art.component';
import { PlaybackIndicatorComponent } from './components/playback-indicator/playback-indicator.component';
import { PlaybackInformationComponent } from './components/playback-information/playback-information.component';
import { PlaybackProgressComponent } from './components/playback-progress/playback-progress.component';
import { PlaybackQueueComponent } from './components/playback-queue/playback-queue.component';
import { PlaybackTimeComponent } from './components/playback-time/playback-time.component';
import { RatingComponent } from './components/rating/rating.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { AdvancedSettingsComponent } from './components/settings/advanced-settings/advanced-settings.component';
import { AppearanceSettingsComponent } from './components/settings/appearance-settings/appearance-settings.component';
import { BehaviorSettingsComponent } from './components/settings/behavior-settings/behavior-settings.component';
import { OnlineSettingsComponent } from './components/settings/online-settings/online-settings.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';
import { StepIndicatorComponent } from './components/step-indicator/step-indicator.component';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';
import { VolumeControlComponent } from './components/volume-control/volume-control.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { WindowControlsComponent } from './components/window-controls/window-controls.component';
import { CdkVirtualScrollViewportPatchDirective } from './directives/cdk-virtual-scroll-viewport-patch-directive';
import { WebviewDirective } from './directives/webview.directive';
import { GlobalErrorHandler } from './globalErrorHandler';
import { AlbumsFilterPipe } from './pipes/albums-filter.pipe';
import { ArtistFilterPipe as ArtistsFilterPipe } from './pipes/artists-filter.pipe';
import { FolderNamePipe } from './pipes/folder-name.pipe';
import { FormatPlaybackTimePipe } from './pipes/format-playback-time';
import { FormatTicksToDateTimeStringPipe } from './pipes/format-ticks-to-date-time-string.pipe';
import { FormatTotalDurationPipe } from './pipes/format-total-duration.pipe';
import { FormatTotalFileSizePipe } from './pipes/format-total-file-size.pipe';
import { FormatTrackDurationPipe } from './pipes/format-track-duration.pipe';
import { FormatTrackNumberPipe } from './pipes/format-track-number.pipe';
import { GenresFilterPipe } from './pipes/genres-filter.pipe';
import { ImageToFilePathPipe } from './pipes/image-to-file-path.pipe';
import { PlaylistsFilterPipe } from './pipes/playlists-filter';
import { SubfolderNamePipe } from './pipes/subfolder-name.pipe';
import { SubfoldersFilterPipe } from './pipes/subfolders-filter.pipe';
import { TracksFilterPipe } from './pipes/tracks-filter.pipe';
import { ZeroToBlankPipe } from './pipes/zero-to-blank.pipe';
import { AlbumArtworkCacheIdFactory } from './services/album-artwork-cache/album-artwork-cache-id-factory';
import { AlbumArtworkCacheService } from './services/album-artwork-cache/album-artwork-cache.service';
import { BaseAlbumArtworkCacheService } from './services/album-artwork-cache/base-album-artwork-cache.service';
import { AlbumService } from './services/album/album-service';
import { BaseAlbumService } from './services/album/base-album-service';
import { AppearanceService } from './services/appearance/appearance.service';
import { BaseAppearanceService } from './services/appearance/base-appearance.service';
import { DefaultThemesCreator } from './services/appearance/default-themes-creator';
import { ApplicationService } from './services/application/application.service';
import { BaseApplicationService } from './services/application/base-application.service';
import { ArtistService } from './services/artist/artist.service';
import { BaseArtistService } from './services/artist/base-artist.service';
import { BaseCollectionService } from './services/collection/base-collection.service';
import { CollectionService } from './services/collection/collection.service';
import { BaseDialogService } from './services/dialog/base-dialog.service';
import { DialogService } from './services/dialog/dialog.service';
import { BaseDiscordService } from './services/discord/base-discord.service';
import { DiscordService } from './services/discord/discord.service';
import { PresenceUpdater } from './services/discord/presence-updater';
import { ElectronService } from './services/electron.service';
import { BaseFileService } from './services/file/base-file.service';
import { FileService } from './services/file/file.service';
import { BaseFolderService } from './services/folder/base-folder.service';
import { FolderService } from './services/folder/folder.service';
import { BaseGenreService } from './services/genre/base-genre.service';
import { GenreService } from './services/genre/genre.service';
import { AlbumArtworkAdder } from './services/indexing/album-artwork-adder';
import { AlbumArtworkGetter } from './services/indexing/album-artwork-getter';
import { AlbumArtworkIndexer } from './services/indexing/album-artwork-indexer';
import { AlbumArtworkRemover } from './services/indexing/album-artwork-remover';
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
import { BaseMetadataService } from './services/metadata/base-metadata.service';
import { MetadataService } from './services/metadata/metadata.service';
import { BaseNavigationService } from './services/navigation/base-navigation.service';
import { NavigationService } from './services/navigation/navigation.service';
import { BasePlaybackIndicationService } from './services/playback-indication/base-playback-indication.service';
import { PlaybackIndicationService } from './services/playback-indication/playback-indication.service';
import { BasePlaybackInformationService } from './services/playback-information/base-playback-information.service';
import { PlaybackInformationService } from './services/playback-information/playback-information.service';
import { AudioPlayer } from './services/playback/audio-player';
import { BaseAudioPlayer } from './services/playback/base-audio-player';
import { BasePlaybackService } from './services/playback/base-playback.service';
import { PlaybackService } from './services/playback/playback.service';
import { ProgressUpdater } from './services/playback/progress-updater';
import { Queue } from './services/playback/queue';
import { BasePlaylistFolderService } from './services/playlist-folder/base-playlist-folder.service';
import { PlaylistFolderModelFactory } from './services/playlist-folder/playlist-folder-model-factory';
import { PlaylistFolderService } from './services/playlist-folder/playlist-folder.service';
import { BasePlaylistService } from './services/playlist/base-playlist.service';
import { PlaylistDecoder } from './services/playlist/playlist-decoder';
import { PlaylistFileManager } from './services/playlist/playlist-file-manager';
import { PlaylistModelFactory } from './services/playlist/playlist-model-factory';
import { PlaylistService } from './services/playlist/playlist.service';
import { BaseScrobblingService } from './services/scrobbling/base-scrobbling.service';
import { ScrobblingService } from './services/scrobbling/scrobbling.service';
import { BaseSearchService } from './services/search/base-search.service';
import { SearchService } from './services/search/search.service';
import { BaseSemanticZoomService } from './services/semantic-zoom/base-semantic-zoom.service';
import { SemanticZoomService } from './services/semantic-zoom/semantic-zoom.service';
import { BaseSnackBarService } from './services/snack-bar/base-snack-bar.service';
import { SnackBarService } from './services/snack-bar/snack-bar.service';
import { BaseTracksColumnsService } from './services/track-columns/base-tracks-columns.service';
import { TracksColumnsOrdering } from './services/track-columns/tracks-columns-ordering';
import { TracksColumnsService } from './services/track-columns/tracks-columns.service';
import { BaseTrackService } from './services/track/base-track.service';
import { TrackModelFactory } from './services/track/track-model-factory';
import { TrackService } from './services/track/track.service';
import { BaseTranslatorService } from './services/translator/base-translator.service';
import { TranslatorService } from './services/translator/translator.service';
import { BaseTrayService } from './services/tray/base-tray.service';
import { TrayService } from './services/tray/tray.service';
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
        ThemeSwitcherComponent,
        AddFolderComponent,
        DialogHeaderComponent,
        ConfirmationDialogComponent,
        InputDialogComponent,
        ErrorDialogComponent,
        LicenseDialogComponent,
        EditColumnsDialogComponent,
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
        BehaviorSettingsComponent,
        AboutComponent,
        ComponentsComponent,
        SnackBarComponent,
        CollectionFoldersComponent,
        CollectionPlaybackPaneComponent,
        VolumeControlComponent,
        FolderNamePipe,
        SubfolderNamePipe,
        FormatTrackNumberPipe,
        FormatTrackDurationPipe,
        FormatTotalDurationPipe,
        FormatTotalFileSizePipe,
        FormatPlaybackTimePipe,
        ArtistsFilterPipe,
        AlbumsFilterPipe,
        GenresFilterPipe,
        TracksFilterPipe,
        SubfoldersFilterPipe,
        PlaylistsFilterPipe,
        ImageToFilePathPipe,
        ZeroToBlankPipe,
        FormatTicksToDateTimeStringPipe,
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
        ArtistComponent,
        GenreComponent,
        TotalsComponent,
        PlaybackIndicatorComponent,
        AlbumComponent,
        ArtistBrowserComponent,
        GenreBrowserComponent,
        AlbumBrowserComponent,
        TrackBrowserComponent,
        PlaybackQueueComponent,
        NowPlayingComponent,
        NowPlayingPlaybackPaneComponent,
        SearchBoxComponent,
        PlaylistFolderBrowserComponent,
        PlaylistBrowserComponent,
        PlaylistComponent,
        EditPlaylistDialogComponent,
        PlaylistTrackBrowserComponent,
        RatingComponent,
        LoveComponent,
        SemanticZoomComponent,
        SemanticZoomButtonComponent,
        CollectionTracksTableComponent,
        CollectionTracksTableHeaderComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        MatSidenavModule,
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
        MatSortModule,
        DragDropModule,
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
        DatabaseFactory,
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
        Shuffler,
        ProgressUpdater,
        Queue,
        MathExtensions,
        CollectionPersister,
        PathValidator,
        AlbumRowsGetter,
        ItemSpaceCalculator,
        NativeElementProxy,
        DocumentProxy,
        GitHubApi,
        MetadataPatcher,
        ArtistOrdering,
        GenreOrdering,
        TrackOrdering,
        TracksColumnsOrdering,
        PresenceUpdater,
        SemanticZoomHeaderAdder,
        DefaultThemesCreator,
        ArtistsPersister,
        ArtistsAlbumsPersister,
        ArtistsTracksPersister,
        GenresPersister,
        GenresAlbumsPersister,
        GenresTracksPersister,
        AlbumsAlbumsPersister,
        AlbumsTracksPersister,
        FoldersPersister,
        PlaylistFoldersPersister,
        CollectionChecker,
        IndexablePathFetcher,
        TextSanitizer,
        ContextMenuOpener,
        PlaylistFolderModelFactory,
        PlaylistModelFactory,
        PlaylistRowsGetter,
        PlaylistsPersister,
        PlaylistsTracksPersister,
        PlaylistFileManager,
        AddToPlaylistMenu,
        TrackModelFactory,
        PlaylistDecoder,
        FileValidator,
        DateProxy,
        DateTime,
        TabSelectionGetter,
        { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: CustomTooltipDefaults },
        { provide: BaseFileAccess, useClass: FileAccess },
        { provide: BaseAlbumArtworkRepository, useClass: AlbumArtworkRepository },
        { provide: BaseRemovedTrackRepository, useClass: RemovedTrackRepository },
        { provide: BaseFolderTrackRepository, useClass: FolderTrackRepository },
        { provide: BaseTrackRepository, useClass: TrackRepository },
        { provide: BaseFolderRepository, useClass: FolderRepository },
        { provide: BaseApplicationService, useClass: ApplicationService },
        { provide: BaseAlbumArtworkCacheService, useClass: AlbumArtworkCacheService },
        { provide: BaseNavigationService, useClass: NavigationService },
        { provide: BaseIndexingService, useClass: IndexingService },
        { provide: BaseTranslatorService, useClass: TranslatorService },
        { provide: BaseUpdateService, useClass: UpdateService },
        { provide: BaseSnackBarService, useClass: SnackBarService },
        { provide: BasePlaybackService, useClass: PlaybackService },
        { provide: BaseDialogService, useClass: DialogService },
        { provide: BaseArtistService, useClass: ArtistService },
        { provide: BaseGenreService, useClass: GenreService },
        { provide: BaseTrackService, useClass: TrackService },
        { provide: BaseAlbumService, useClass: AlbumService },
        { provide: BaseCollectionService, useClass: CollectionService },
        { provide: BaseDiscordService, useClass: DiscordService },
        { provide: BasePlaybackIndicationService, useClass: PlaybackIndicationService },
        { provide: BasePlaybackInformationService, useClass: PlaybackInformationService },
        { provide: BaseMetadataService, useClass: MetadataService },
        { provide: BaseSearchService, useClass: SearchService },
        { provide: BasePlaylistService, useClass: PlaylistService },
        { provide: BasePlaylistFolderService, useClass: PlaylistFolderService },
        { provide: BaseAppearanceService, useClass: AppearanceService },
        { provide: BaseFolderService, useClass: FolderService },
        { provide: BaseFileService, useClass: FileService },
        { provide: BaseTrayService, useClass: TrayService },
        { provide: BaseSemanticZoomService, useClass: SemanticZoomService },
        { provide: BaseSettings, useClass: Settings },
        { provide: BaseDatabaseMigrator, useClass: DatabaseMigrator },
        { provide: BaseScheduler, useClass: Scheduler },
        { provide: BaseApplication, useClass: Application },
        { provide: BaseIpcProxy, useClass: IpcProxy },
        { provide: BaseTranslateServiceProxy, useClass: TranslateServiceProxy },
        { provide: BaseAudioPlayer, useClass: AudioPlayer },
        { provide: BaseDesktop, useClass: Desktop },
        { provide: BaseFileMetadataFactory, useClass: FileMetadataFactory },
        { provide: BaseTracksColumnsService, useClass: TracksColumnsService },
        { provide: BaseScrobblingService, useClass: ScrobblingService },
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler,
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
