import { Injectable } from '@angular/core';
import { FileFormats } from '../../common/application/file-formats';
import { Track } from '../../data/entities/track';
import { StringUtils } from '../../common/utils/string-utils';
import { ArtistType } from '../artist/artist-type';
import { TrackModel } from './track-model';
import { TrackModelFactory } from './track-model-factory';
import { TrackModels } from './track-models';
import { TrackServiceBase } from './track.service.base';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { FileAccessBase } from '../../common/io/file-access.base';
import { SettingsBase } from '../../common/settings/settings.base';
import { ArtistModel } from '../artist/artist-model';
import { Timer } from '../../common/scheduling/timer';
import { Logger } from '../../common/logger';
import { ArtistServiceBase } from '../artist/artist.service.base';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Injectable()
export class TrackService implements TrackServiceBase {
    public constructor(
        private artistService: ArtistServiceBase,
        private trackModelFactory: TrackModelFactory,
        private trackRepository: TrackRepositoryBase,
        private fileAccess: FileAccessBase,
        private settings: SettingsBase,
        private logger: Logger,
    ) {}

    public async getTracksInSubfolderAsync(subfolderPath: string): Promise<TrackModels> {
        const timer = new Timer();
        timer.start();

        if (StringUtils.isNullOrWhiteSpace(subfolderPath)) {
            return new TrackModels();
        }

        const subfolderPathExists: boolean = this.fileAccess.pathExists(subfolderPath);

        if (!subfolderPathExists) {
            return new TrackModels();
        }

        const filesInDirectory: string[] = await this.fileAccess.getFilesInDirectoryAsync(subfolderPath);

        const trackModels: TrackModels = new TrackModels();

        const albumKeyIndex: string = this.settings.albumKeyIndex;

        const tracksInDatabase: Track[] = (await this.trackRepository.getTracksForPathsAsync(filesInDirectory)) ?? [];
        const pathsInDatabaseSet = new Set(tracksInDatabase.map((x) => x.path));

        for (const file of filesInDirectory) {
            const fileExtension: string = this.fileAccess.getFileExtension(file);
            const fileExtensionIsSupported: boolean = FileFormats.supportedAudioExtensions.includes(fileExtension.toLowerCase());

            if (fileExtensionIsSupported) {
                let trackModel: TrackModel;

                if (pathsInDatabaseSet.has(file)) {
                    const trackInDatabase: Track = tracksInDatabase.find((x) => x.path === file) as Track;
                    trackModel = this.trackModelFactory.createFromTrack(trackInDatabase, albumKeyIndex);
                } else {
                    trackModel = await this.trackModelFactory.createFromFileAsync(file, albumKeyIndex);
                }

                trackModels.addTrack(trackModel);
            }
        }

        timer.stop();

        this.logger.info(
            `Finished getting tracks in subfolders. Time required: ${timer.elapsedMilliseconds} ms`,
            'TrackService',
            'getTracksInSubfolderAsync',
        );

        return trackModels;
    }

    public async getVisibleTracksAsync(): Promise<TrackModels> {
        const timer = new Timer();
        timer.start();

        const tracks: Track[] = (await this.trackRepository.getVisibleTracksAsync()) ?? [];
        const trackModels: TrackModels = new TrackModels();

        const albumKeyIndex: string = this.settings.albumKeyIndex;

        for (const track of tracks) {
            const trackModel: TrackModel = this.trackModelFactory.createFromTrack(track, albumKeyIndex);
            trackModels.addTrack(trackModel);
        }

        timer.stop();

        this.logger.info(
            `Finished getting visible tracks. Time required: ${timer.elapsedMilliseconds} ms`,
            'TrackService',
            'getVisibleTracks',
        );

        return trackModels;
    }

    public async getTracksForAlbumsAsync(albumKeys: string[]): Promise<TrackModels> {
        const timer = new Timer();
        timer.start();

        const trackModels: TrackModels = new TrackModels();

        if (albumKeys.length === 0) {
            return trackModels;
        }

        const tracks: Track[] = (await this.trackRepository.getTracksForAlbumsAsync(this.settings.albumKeyIndex, albumKeys)) ?? [];

        const albumKeyIndex: string = this.settings.albumKeyIndex;

        for (const track of tracks) {
            const trackModel: TrackModel = this.trackModelFactory.createFromTrack(track, albumKeyIndex);
            trackModels.addTrack(trackModel);
        }

        timer.stop();

        this.logger.info(
            `Finished getting tracks for albums. Time required: ${timer.elapsedMilliseconds} ms`,
            'TrackService',
            'getTracksForAlbums',
        );

        return trackModels;
    }

    public async getTracksForArtistsAsync(artists: ArtistModel[], artistType: ArtistType): Promise<TrackModels> {
        const timer = new Timer();
        timer.start();

        const trackModels: TrackModels = new TrackModels();

        if (artists.length === 0) {
            return trackModels;
        }

        const sourceArtists: string[] = this.artistService.getSourceArtists(artists);

        if (artistType === ArtistType.trackArtists || artistType === ArtistType.allArtists) {
            await this.addTracksForTrackOrAllArtistsAsync(sourceArtists, trackModels);
        }

        if (artistType === ArtistType.albumArtists || artistType === ArtistType.allArtists) {
            await this.addTracksForAlbumOrAllArtistsAsync(sourceArtists, trackModels);
        }

        timer.stop();

        this.logger.info(
            `Finished getting tracks for artists. Time required: ${timer.elapsedMilliseconds} ms`,
            'TrackService',
            'getTracksForArtists',
        );

        return trackModels;
    }

    public async getTracksForGenresAsync(genres: string[]): Promise<TrackModels> {
        const timer = new Timer();
        timer.start();

        const trackModels: TrackModels = new TrackModels();

        if (genres.length === 0) {
            return trackModels;
        }

        const tracks: Track[] = (await this.trackRepository.getTracksForGenresAsync(genres)) ?? [];

        const albumKeyIndex: string = this.settings.albumKeyIndex;

        for (const track of tracks) {
            const trackModel: TrackModel = this.trackModelFactory.createFromTrack(track, albumKeyIndex);
            trackModels.addTrack(trackModel);
        }

        timer.stop();

        this.logger.info(
            `Finished getting tracks for genres. Time required: ${timer.elapsedMilliseconds} ms`,
            'TrackService',
            'getTracksForGenres',
        );

        return trackModels;
    }

    private async addTracksForTrackOrAllArtistsAsync(artists: string[], trackModels: TrackModels): Promise<void> {
        const trackArtistTracks: Track[] = (await this.trackRepository.getTracksForTrackArtistsAsync(artists)) ?? [];

        const albumKeyIndex: string = this.settings.albumKeyIndex;

        for (const track of trackArtistTracks) {
            const trackModel: TrackModel = this.trackModelFactory.createFromTrack(track, albumKeyIndex);
            trackModels.addTrack(trackModel);
        }
    }

    private async addTracksForAlbumOrAllArtistsAsync(artists: string[], trackModels: TrackModels): Promise<void> {
        const albumArtistTracks: Track[] = (await this.trackRepository.getTracksForAlbumArtistsAsync(artists)) ?? [];

        const albumKeyIndex: string = this.settings.albumKeyIndex;

        for (const track of albumArtistTracks) {
            const trackModel: TrackModel = this.trackModelFactory.createFromTrack(track, albumKeyIndex);

            // Avoid adding a track twice
            // TODO: can this be done better?
            if (!trackModels.tracks.map((x) => x.path).includes(trackModel.path)) {
                trackModels.addTrack(trackModel);
            }
        }
    }

    public async savePlayCountAndDateLastPlayedAsync(track: TrackModel): Promise<void> {
        await this.trackRepository.updatePlayCountAndDateLastPlayedAsync(track.id, track.playCount, track.dateLastPlayed);
    }

    public async saveSkipCountAsync(track: TrackModel): Promise<void> {
        await this.trackRepository.updateSkipCountAsync(track.id, track.skipCount);
    }

    public scrollToPlayingTrack(tracks: TrackModel[], viewPort: CdkVirtualScrollViewport): void {
        if (!this.settings.jumpToPlayingSong) {
            return;
        }

        const playingIndex = tracks.findIndex((t) => t.isPlaying);
        if (playingIndex > -1) {
            setTimeout(() => viewPort.scrollToIndex(playingIndex - 1, 'smooth')); // Scroll to 1 track higher than the current one, giving some breathing room.
        }
    }
}
