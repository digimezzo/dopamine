import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LOCATION_INITIALIZED } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, Injector, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions, MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularSplitModule } from 'angular-split';
import 'reflect-metadata';
import '../polyfills';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FanartApi } from './common/api/fanart/fanart.api';
import { GitHubApi } from './common/api/git-hub/git-hub.api';
import { LastfmApi } from './common/api/lastfm/lastfm.api';
import { AlbumKeyGenerator } from './data/album-key-generator';
import { DatabaseFactory } from './data/database-factory';
import { DatabaseMigrator } from './data/database-migrator';
import { AlbumArtworkRepository } from './data/repositories/album-artwork-repository';
import { FolderRepository } from './data/repositories/folder-repository';
import { FolderTrackRepository } from './data/repositories/folder-track-repository';
import { RemovedTrackRepository } from './data/repositories/removed-track-repository';
import { TrackRepository } from './data/repositories/track-repository';
import { DateTime } from './common/date-time';
import { GuidFactory } from './common/guid.factory';
import { Hacks } from './common/hacks';
import { ImageProcessor } from './common/image-processor';
import { Application } from './common/io/application';
import { DateProxy } from './common/io/date-proxy';
import { DocumentProxy } from './common/io/document-proxy';
import { FileAccess } from './common/io/file-access';
import { IpcProxy } from './common/io/ipc-proxy';
import { LogViewer } from './common/io/log-viewer';
import { MediaSessionProxy } from './common/io/media-session-proxy';
import { TranslateServiceProxy } from './common/io/translate-service-proxy';
import { Logger } from './common/logger';
import { MathExtensions } from './common/math-extensions';
import { FileMetadataFactory } from './common/metadata/file-metadata.factory';
import { MetadataPatcher } from './common/metadata/metadata-patcher';
import { MimeTypes } from './common/metadata/mime-types';
import { NativeElementProxy } from './common/native-element-proxy';
import { ArtistOrdering } from './common/ordering/artist-ordering';
import { GenreOrdering } from './common/ordering/genre-ordering';
import { TrackOrdering } from './common/ordering/track-ordering';
import { Scheduler } from './common/scheduling/scheduler';
import { SemanticZoomHeaderAdder } from './common/semantic-zoom-header-adder';
import { SettingsBase } from './common/settings/settings.base';
import { Settings } from './common/settings/settings';
import { Shuffler } from './common/shuffler';
import { TextSanitizer } from './common/text-sanitizer';
import { AddFolderComponent } from './ui/components/add-folder/add-folder.component';
import { AddToPlaylistMenu } from './ui/components/add-to-playlist-menu';
import { BackButtonComponent } from './ui/components/back-button/back-button.component';
import { AlbumBrowserComponent } from './ui/components/collection/album-browser/album-browser.component';
import { AlbumRowsGetter } from './ui/components/collection/album-browser/album-rows-getter';
import { AlbumComponent } from './ui/components/collection/album-browser/album/album.component';
import { AlbumsAlbumsPersister } from './ui/components/collection/collection-albums/albums-albums-persister';
import { AlbumsTracksPersister } from './ui/components/collection/collection-albums/albums-tracks-persister';
import { CollectionAlbumsComponent } from './ui/components/collection/collection-albums/collection-albums.component';
import { ArtistBrowserComponent } from './ui/components/collection/collection-artists/artist-browser/artist-browser.component';
import { ArtistComponent } from './ui/components/collection/collection-artists/artist/artist.component';
import { ArtistsAlbumsPersister } from './ui/components/collection/collection-artists/artists-albums-persister';
import { ArtistsPersister } from './ui/components/collection/collection-artists/artists-persister';
import { ArtistsTracksPersister } from './ui/components/collection/collection-artists/artists-tracks-persister';
import { CollectionArtistsComponent } from './ui/components/collection/collection-artists/collection-artists.component';
import { CollectionFoldersComponent } from './ui/components/collection/collection-folders/collection-folders.component';
import { FolderTracksPersister } from './ui/components/collection/collection-folders/folder-tracks-persister';
import { FoldersPersister } from './ui/components/collection/collection-folders/folders-persister';
import { CollectionGenresComponent } from './ui/components/collection/collection-genres/collection-genres.component';
import { GenreBrowserComponent } from './ui/components/collection/collection-genres/genre-browser/genre-browser.component';
import { GenreComponent } from './ui/components/collection/collection-genres/genre/genre.component';
import { GenresAlbumsPersister } from './ui/components/collection/collection-genres/genres-albums-persister';
import { GenresPersister } from './ui/components/collection/collection-genres/genres-persister';
import { GenresTracksPersister } from './ui/components/collection/collection-genres/genres-tracks-persister';
import { CollectionPersister } from './ui/components/collection/collection-persister';
import { CollectionPlaybackPaneComponent } from './ui/components/collection/collection-playback-pane/collection-playback-pane.component';
import { CollectionPlaylistsComponent } from './ui/components/collection/collection-playlists/collection-playlists.component';
import { PlaylistBrowserComponent } from './ui/components/collection/collection-playlists/playlist-browser/playlist-browser.component';
import { PlaylistComponent } from './ui/components/collection/collection-playlists/playlist-browser/playlist/playlist.component';
import { PlaylistFolderBrowserComponent } from './ui/components/collection/collection-playlists/playlist-folder-browser/playlist-folder-browser.component';
import { PlaylistRowsGetter } from './ui/components/collection/collection-playlists/playlist-folder-browser/playlist-rows-getter';
import { PlaylistFoldersPersister } from './ui/components/collection/collection-playlists/playlist-folders-persister';
import { PlaylistTrackBrowserComponent } from './ui/components/collection/collection-playlists/playlist-track-browser/playlist-track-browser.component';
import { PlaylistsPersister } from './ui/components/collection/collection-playlists/playlists-persister';
import { PlaylistsTracksPersister } from './ui/components/collection/collection-playlists/playlists-tracks-persister';
import { CollectionTracksTableHeaderComponent } from './ui/components/collection/collection-tracks/collection-tracks-table/collection-tracks-table-header/collection-tracks-table-header.component';
import { CollectionTracksTableComponent } from './ui/components/collection/collection-tracks/collection-tracks-table/collection-tracks-table.component';
import { CollectionTracksComponent } from './ui/components/collection/collection-tracks/collection-tracks.component';
import { CollectionComponent } from './ui/components/collection/collection.component';
import { ItemSpaceCalculator } from './ui/components/collection/item-space-calculator';
import { SemanticZoomButtonComponent } from './ui/components/collection/semantic-zoom/semantic-zoom-button/semantic-zoom-button.component';
import { SemanticZoomComponent } from './ui/components/collection/semantic-zoom/semantic-zoom.component';
import { TabSelectionGetter } from './ui/components/collection/tab-selection-getter';
import { TotalsComponent } from './ui/components/collection/totals/totals.component';
import { TrackBrowserComponent } from './ui/components/collection/track-browser/track-browser.component';
import { TrackComponent } from './ui/components/collection/track/track.component';
import { ConfirmationDialogComponent } from './ui/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DialogHeaderComponent } from './ui/components/dialogs/dialog-header/dialog-header.component';
import { EditColumnsDialogComponent } from './ui/components/dialogs/edit-columns-dialog/edit-columns-dialog.component';
import { EditPlaylistDialogComponent } from './ui/components/dialogs/edit-playlist-dialog/edit-playlist-dialog.component';
import { ErrorDialogComponent } from './ui/components/dialogs/error-dialog/error-dialog.component';
import { InputDialogComponent } from './ui/components/dialogs/input-dialog/input-dialog.component';
import { LicenseDialogComponent } from './ui/components/dialogs/license-dialog/license-dialog.component';
import { AboutComponent } from './ui/components/information/about/about.component';
import { ComponentsComponent } from './ui/components/information/components/components.component';
import { InformationComponent } from './ui/components/information/information.component';
import { LoadingComponent } from './ui/components/loading/loading.component';
import { LogoFullComponent } from './ui/components/logo-full/logo-full.component';
import { LogoSmallComponent } from './ui/components/logo-small/logo-small.component';
import { LoveComponent } from './ui/components/love/love.component';
import { MainMenuComponent } from './ui/components/main-menu/main-menu.component';
import { ManageAlbumCoversComponent } from './ui/components/manage-collection/manage-album-covers/manage-album-covers.component';
import { ManageCollectionComponent } from './ui/components/manage-collection/manage-collection.component';
import { ManageMusicComponent } from './ui/components/manage-collection/manage-music/manage-music.component';
import { ManageRefreshComponent } from './ui/components/manage-collection/manage-refresh/manage-refresh.component';
import { NowPlayingArtistInfoComponent } from './ui/components/now-playing/now-playing-artist-info/now-playing-artist-info.component';
import { SimilarArtistComponent } from './ui/components/now-playing/now-playing-artist-info/similar-artist/similar-artist.component';
import { NowPlayingLyricsComponent } from './ui/components/now-playing/now-playing-lyrics/now-playing-lyrics.component';
import { NowPlayingPlaybackPaneComponent } from './ui/components/now-playing/now-playing-playback-pane/now-playing-playback-pane.component';
import { NowPlayingShowcaseComponent } from './ui/components/now-playing/now-playing-showcase/now-playing-showcase.component';
import { NowPlayingComponent } from './ui/components/now-playing/now-playing.component';
import { PlaybackControlsComponent } from './ui/components/playback-controls/playback-controls.component';
import { PlaybackCoverArtComponent } from './ui/components/playback-cover-art/playback-cover-art.component';
import { PlaybackIndicatorComponent } from './ui/components/playback-indicator/playback-indicator.component';
import { PlaybackInformationComponent } from './ui/components/playback-information/playback-information.component';
import { PlaybackProgressComponent } from './ui/components/playback-progress/playback-progress.component';
import { PlaybackQueueComponent } from './ui/components/playback-queue/playback-queue.component';
import { PlaybackTimeComponent } from './ui/components/playback-time/playback-time.component';
import { RatingComponent } from './ui/components/rating/rating.component';
import { SearchBoxComponent } from './ui/components/search-box/search-box.component';
import { AdvancedSettingsComponent } from './ui/components/settings/advanced-settings/advanced-settings.component';
import { AppearanceSettingsComponent } from './ui/components/settings/appearance-settings/appearance-settings.component';
import { BehaviorSettingsComponent } from './ui/components/settings/behavior-settings/behavior-settings.component';
import { OnlineSettingsComponent } from './ui/components/settings/online-settings/online-settings.component';
import { SettingsComponent } from './ui/components/settings/settings.component';
import { SliderComponent } from './ui/components/slider/slider.component';
import { SnackBarComponent } from './ui/components/snack-bar/snack-bar.component';
import { StepIndicatorComponent } from './ui/components/step-indicator/step-indicator.component';
import { ThemeSwitcherComponent } from './ui/components/theme-switcher/theme-switcher.component';
import { VolumeControlComponent } from './ui/components/volume-control/volume-control.component';
import { WelcomeComponent } from './ui/components/welcome/welcome.component';
import { WindowControlsComponent } from './ui/components/window-controls/window-controls.component';
import { CdkVirtualScrollViewportPatchDirective } from './ui/directives/cdk-virtual-scroll-viewport-patch-directive';
import { WebviewDirective } from './ui/directives/webview.directive';
import { GlobalErrorHandler } from './globalErrorHandler';
import { AlbumsFilterPipe } from './ui/pipes/albums-filter.pipe';
import { FolderNamePipe } from './ui/pipes/folder-name.pipe';
import { FormatPlaybackTimePipe } from './ui/pipes/format-playback-time';
import { FormatTicksToDateTimeStringPipe } from './ui/pipes/format-ticks-to-date-time-string.pipe';
import { FormatTotalDurationPipe } from './ui/pipes/format-total-duration.pipe';
import { FormatTotalFileSizePipe } from './ui/pipes/format-total-file-size.pipe';
import { FormatTrackDurationPipe } from './ui/pipes/format-track-duration.pipe';
import { FormatTrackNumberPipe } from './ui/pipes/format-track-number.pipe';
import { GenresFilterPipe } from './ui/pipes/genres-filter.pipe';
import { ImageToFilePathPipe } from './ui/pipes/image-to-file-path.pipe';
import { PlaylistsFilterPipe } from './ui/pipes/playlists-filter';
import { SubfolderNamePipe } from './ui/pipes/subfolder-name.pipe';
import { SubfoldersFilterPipe } from './ui/pipes/subfolders-filter.pipe';
import { TracksFilterPipe } from './ui/pipes/tracks-filter.pipe';
import { ZeroToBlankPipe } from './ui/pipes/zero-to-blank.pipe';
import { AlbumArtworkCacheIdFactory } from './services/album-artwork-cache/album-artwork-cache-id-factory';
import { AlbumArtworkCacheService } from './services/album-artwork-cache/album-artwork-cache.service';
import { AlbumService } from './services/album/album-service';
import { AppearanceService } from './services/appearance/appearance.service';
import { DefaultThemesCreator } from './services/appearance/default-themes-creator';
import { ApplicationService } from './services/application/application.service';
import { ArtistInformationFactory } from './services/artist-information/artist-information-factory';
import { ArtistInformationService } from './services/artist-information/artist-information.service';
import { ArtistService } from './services/artist/artist.service';
import { CollectionService } from './services/collection/collection.service';
import { DialogService } from './services/dialog/dialog.service';
import { DiscordService } from './services/discord/discord.service';
import { PresenceUpdater } from './services/discord/presence-updater';
import { ElectronService } from './services/electron.service';
import { FileService } from './services/file/file.service';
import { FolderService } from './services/folder/folder.service';
import { GenreService } from './services/genre/genre.service';
import { AlbumArtworkAdder } from './services/indexing/album-artwork-adder';
import { AlbumArtworkGetter } from './services/indexing/album-artwork-getter';
import { AlbumArtworkIndexer } from './services/indexing/album-artwork-indexer';
import { AlbumArtworkRemover } from './services/indexing/album-artwork-remover';
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
import { MediaSessionService } from './services/media-session/media-session.service';
import { CachedAlbumArtworkGetter } from './services/metadata/cached-album-artwork-getter';
import { MetadataService } from './services/metadata/metadata.service';
import { NavigationService } from './services/navigation/navigation.service';
import { NowPlayingNavigationService } from './services/now-playing-navigation/now-playing-navigation.service';
import { PlaybackIndicationService } from './services/playback-indication/playback-indication.service';
import { PlaybackInformationService } from './services/playback-information/playback-information.service';
import { AudioPlayer } from './services/playback/audio-player';
import { PlaybackService } from './services/playback/playback.service';
import { ProgressUpdater } from './services/playback/progress-updater';
import { Queue } from './services/playback/queue';
import { PlaylistFolderModelFactory } from './services/playlist-folder/playlist-folder-model-factory';
import { PlaylistFolderService } from './services/playlist-folder/playlist-folder.service';
import { PlaylistDecoder } from './services/playlist/playlist-decoder';
import { PlaylistFileManager } from './services/playlist/playlist-file-manager';
import { PlaylistModelFactory } from './services/playlist/playlist-model-factory';
import { PlaylistService } from './services/playlist/playlist.service';
import { ScrobblingService } from './services/scrobbling/scrobbling.service';
import { SearchService } from './services/search/search.service';
import { SemanticZoomService } from './services/semantic-zoom/semantic-zoom.service';
import { SnackBarService } from './services/snack-bar/snack-bar.service';
import { TracksColumnsOrdering } from './services/track-columns/tracks-columns-ordering';
import { TracksColumnsService } from './services/track-columns/tracks-columns.service';
import { TrackModelFactory } from './services/track/track-model-factory';
import { TrackService } from './services/track/track.service';
import { TranslatorService } from './services/translator/translator.service';
import { TrayService } from './services/tray/tray.service';
import { UpdateService } from './services/update/update.service';
import { LyricsService } from './services/lyrics/lyrics.service';
import { EmbeddedLyricsGetter } from './services/lyrics/embedded-lyrics-getter';
import { LrcLyricsGetter } from './services/lyrics/lrc-lyrics-getter';
import { OnlineLyricsGetter } from './services/lyrics/online-lyrics-getter';
import { IntegrationTestRunner } from './testing/integration-test-runner';
import { EventListenerService } from './services/event-listener/event-listener.service';
import { Desktop } from './common/io/desktop';
import { AudioPlayerBase } from './services/playback/audio-player.base';
import { EventListenerServiceBase } from './services/event-listener/event-listener.service.base';
import { LyricsServiceBase } from './services/lyrics/lyrics.service.base';
import { ArtistInformationServiceBase } from './services/artist-information/artist-information.service.base';
import { NowPlayingNavigationServiceBase } from './services/now-playing-navigation/now-playing-navigation.service.base';
import { ScrobblingServiceBase } from './services/scrobbling/scrobbling.service.base';
import { TracksColumnsServiceBase } from './services/track-columns/tracks-columns.service.base';
import { SemanticZoomServiceBase } from './services/semantic-zoom/semantic-zoom.service.base';
import { TrayServiceBase } from './services/tray/tray.service.base';
import { FileServiceBase } from './services/file/file.service.base';
import { FolderServiceBase } from './services/folder/folder.service.base';
import { AppearanceServiceBase } from './services/appearance/appearance.service.base';
import { PlaylistFolderServiceBase } from './services/playlist-folder/playlist-folder.service.base';
import { PlaylistServiceBase } from './services/playlist/playlist.service.base';
import { SearchServiceBase } from './services/search/search.service.base';
import { MetadataServiceBase } from './services/metadata/metadata.service.base';
import { MediaSessionServiceBase } from './services/media-session/media-session.service.base';
import { PlaybackInformationServiceBase } from './services/playback-information/playback-information.service.base';
import { PlaybackIndicationServiceBase } from './services/playback-indication/playback-indication.service.base';
import { DiscordServiceBase } from './services/discord/discord.service.base';
import { CollectionServiceBase } from './services/collection/collection.service.base';
import { AlbumServiceBase } from './services/album/album-service.base';
import { TrackServiceBase } from './services/track/track.service.base';
import { GenreServiceBase } from './services/genre/genre.service.base';
import { ArtistServiceBase } from './services/artist/artist.service.base';
import { DialogServiceBase } from './services/dialog/dialog.service.base';
import { PlaybackServiceBase } from './services/playback/playback.service.base';
import { SnackBarServiceBase } from './services/snack-bar/snack-bar.service.base';
import { UpdateServiceBase } from './services/update/update.service.base';
import { TranslatorServiceBase } from './services/translator/translator.service.base';
import { IndexingServiceBase } from './services/indexing/indexing.service.base';
import { NavigationServiceBase } from './services/navigation/navigation.service.base';
import { AlbumArtworkCacheServiceBase } from './services/album-artwork-cache/album-artwork-cache.service.base';
import { ApplicationServiceBase } from './services/application/application.service.base';
import { AZLyricsApi } from './common/api/lyrics/a-z-lyrics.api';
import { ChartLyricsApi } from './common/api/lyrics/chart-lyrics.api';
import { WebSearchLyricsApi } from './common/api/lyrics/web-search-lyrics/web-search-lyrics.api';
import { WebSearchApi } from './common/api/lyrics/web-search-lyrics/web-search.api';
import { ArtistsFilterPipe } from './ui/pipes/artists-filter.pipe';
import { AlbumArtworkRepositoryBase } from './data/repositories/album-artwork-repository.base';
import { FolderTrackRepositoryBase } from './data/repositories/folder-track-repository.base';
import { TrackRepositoryBase } from './data/repositories/track-repository.base';
import { RemovedTrackRepositoryBase } from './data/repositories/removed-track-repository.base';
import { FolderRepositoryBase } from './data/repositories/folder-repository.base';
import { DatabaseMigratorBase } from './data/database-migrator.base';
import { ApplicationBase } from './common/io/application.base';
import { IpcProxyBase } from './common/io/ipc-proxy.base';
import { TranslateServiceProxyBase } from './common/io/translate-service-proxy.base';
import { MediaSessionProxyBase } from './common/io/media-session-proxy.base';
import { DesktopBase } from './common/io/desktop.base';
import { FileAccessBase } from './common/io/file-access.base';
import { FileMetadataFactoryBase } from './common/metadata/file-metadata.factory.base';
import { SchedulerBase } from './common/scheduling/scheduler.base';
import { ContextMenuOpener } from './ui/components/context-menu-opener';
import { PathValidator } from './common/validation/path-validator';
import { FileValidator } from './common/validation/file-validator';
import { AudioVisualizer } from './services/playback/audio-visualizer';
import { AudioVisualizerServiceBase } from './services/audio-visualizer/audio-visualizer.service.base';
import { AudioVisualizerService } from './services/audio-visualizer/audio-visualizer.service';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/** Custom options the configure the tooltip's default show/hide delays. */
export const CustomTooltipDefaults: MatTooltipDefaultOptions = {
    showDelay: 500,
    hideDelay: 0,
    touchendHideDelay: 0,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function appInitializerFactory(translate: TranslateService, injector: Injector): () => Promise<any> {
    return () =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve: any) => {
            const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(undefined));
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            locationInitialized.then(() => {
                const languageToSet: string = 'en';
                translate.setDefaultLang(languageToSet);
                translate.use(languageToSet).subscribe(
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    () => {},
                    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
                    (err) => {},
                    () => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                        resolve(undefined);
                    },
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
        SliderComponent,
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
        NowPlayingShowcaseComponent,
        NowPlayingArtistInfoComponent,
        NowPlayingLyricsComponent,
        SimilarArtistComponent,
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
        CachedAlbumArtworkGetter,
        AlbumArtworkIndexer,
        AlbumArtworkAdder,
        AlbumArtworkRemover,
        ExternalArtworkPathGetter,
        LastfmApi,
        Logger,
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
        FanartApi,
        ChartLyricsApi,
        AZLyricsApi,
        WebSearchLyricsApi,
        WebSearchApi,
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
        FolderTracksPersister,
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
        LogViewer,
        ArtistInformationFactory,
        GuidFactory,
        EmbeddedLyricsGetter,
        LrcLyricsGetter,
        OnlineLyricsGetter,
        IntegrationTestRunner,
        AudioVisualizer,
        { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: CustomTooltipDefaults },
        { provide: FileAccessBase, useClass: FileAccess },
        { provide: AlbumArtworkRepositoryBase, useClass: AlbumArtworkRepository },
        { provide: RemovedTrackRepositoryBase, useClass: RemovedTrackRepository },
        { provide: FolderTrackRepositoryBase, useClass: FolderTrackRepository },
        { provide: TrackRepositoryBase, useClass: TrackRepository },
        { provide: FolderRepositoryBase, useClass: FolderRepository },
        { provide: ApplicationServiceBase, useClass: ApplicationService },
        { provide: AlbumArtworkCacheServiceBase, useClass: AlbumArtworkCacheService },
        { provide: NavigationServiceBase, useClass: NavigationService },
        { provide: IndexingServiceBase, useClass: IndexingService },
        { provide: TranslatorServiceBase, useClass: TranslatorService },
        { provide: UpdateServiceBase, useClass: UpdateService },
        { provide: SnackBarServiceBase, useClass: SnackBarService },
        { provide: PlaybackServiceBase, useClass: PlaybackService },
        { provide: DialogServiceBase, useClass: DialogService },
        { provide: ArtistServiceBase, useClass: ArtistService },
        { provide: GenreServiceBase, useClass: GenreService },
        { provide: TrackServiceBase, useClass: TrackService },
        { provide: AlbumServiceBase, useClass: AlbumService },
        { provide: CollectionServiceBase, useClass: CollectionService },
        { provide: DiscordServiceBase, useClass: DiscordService },
        { provide: PlaybackIndicationServiceBase, useClass: PlaybackIndicationService },
        { provide: PlaybackInformationServiceBase, useClass: PlaybackInformationService },
        { provide: MediaSessionServiceBase, useClass: MediaSessionService },
        { provide: MetadataServiceBase, useClass: MetadataService },
        { provide: SearchServiceBase, useClass: SearchService },
        { provide: PlaylistServiceBase, useClass: PlaylistService },
        { provide: PlaylistFolderServiceBase, useClass: PlaylistFolderService },
        { provide: AppearanceServiceBase, useClass: AppearanceService },
        { provide: FolderServiceBase, useClass: FolderService },
        { provide: FileServiceBase, useClass: FileService },
        { provide: TrayServiceBase, useClass: TrayService },
        { provide: SemanticZoomServiceBase, useClass: SemanticZoomService },
        { provide: TracksColumnsServiceBase, useClass: TracksColumnsService },
        { provide: ScrobblingServiceBase, useClass: ScrobblingService },
        { provide: NowPlayingNavigationServiceBase, useClass: NowPlayingNavigationService },
        { provide: ArtistInformationServiceBase, useClass: ArtistInformationService },
        { provide: LyricsServiceBase, useClass: LyricsService },
        { provide: EventListenerServiceBase, useClass: EventListenerService },
        { provide: AudioVisualizerServiceBase, useClass: AudioVisualizerService },
        { provide: AudioPlayerBase, useClass: AudioPlayer },
        { provide: SettingsBase, useClass: Settings },
        { provide: DatabaseMigratorBase, useClass: DatabaseMigrator },
        { provide: SchedulerBase, useClass: Scheduler },
        { provide: ApplicationBase, useClass: Application },
        { provide: IpcProxyBase, useClass: IpcProxy },
        { provide: TranslateServiceProxyBase, useClass: TranslateServiceProxy },
        { provide: MediaSessionProxyBase, useClass: MediaSessionProxy },
        { provide: DesktopBase, useClass: Desktop },
        { provide: FileMetadataFactoryBase, useClass: FileMetadataFactory },
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
