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

@Injectable()
export class TrackService implements TrackServiceBase {
    public constructor(
        private trackModelFactory: TrackModelFactory,
        private trackRepository: TrackRepositoryBase,
        private fileAccess: FileAccessBase,
        private settings: SettingsBase,
    ) {}

    public async getTracksInSubfolderAsync(subfolderPath: string): Promise<TrackModels> {
        if (StringUtils.isNullOrWhiteSpace(subfolderPath)) {
            return new TrackModels();
        }

        const subfolderPathExists: boolean = this.fileAccess.pathExists(subfolderPath);

        if (!subfolderPathExists) {
            return new TrackModels();
        }

        const filesInDirectory: string[] = await this.fileAccess.getFilesInDirectoryAsync(subfolderPath);

        const trackModels: TrackModels = new TrackModels();

        for (const file of filesInDirectory) {
            const fileExtension: string = this.fileAccess.getFileExtension(file);
            const fileExtensionIsSupported: boolean = FileFormats.supportedAudioExtensions.includes(fileExtension.toLowerCase());

            if (fileExtensionIsSupported) {
                const trackModel: TrackModel = await this.trackModelFactory.createFromFileAsync(file);
                trackModels.addTrack(trackModel);
            }
        }

        return trackModels;
    }

    public getVisibleTracks(): TrackModels {
        const tracks: Track[] = this.trackRepository.getVisibleTracks() ?? [];
        const trackModels: TrackModels = new TrackModels();

        for (const track of tracks) {
            const trackModel: TrackModel = this.trackModelFactory.createFromTrack(track);
            trackModels.addTrack(trackModel);
        }

        return trackModels;
    }

    public getTracksForAlbums(albumKeys: string[]): TrackModels {
        const trackModels: TrackModels = new TrackModels();

        if (albumKeys.length === 0) {
            return trackModels;
        }

        const tracks: Track[] = this.trackRepository.getTracksForAlbums(this.settings.albumKeyIndex, albumKeys) ?? [];

        for (const track of tracks) {
            const trackModel: TrackModel = this.trackModelFactory.createFromTrack(track);
            trackModels.addTrack(trackModel);
        }

        return trackModels;
    }

    public getTracksForArtists(artists: ArtistModel[], artistType: ArtistType): TrackModels {
        const trackModels: TrackModels = new TrackModels();

        if (artists.length === 0) {
            return trackModels;
        }

        const sourceArtists: string[] = artists.reduce<string[]>(
            (acc, artist) => (artist.sourceNames ? acc.concat(artist.sourceNames) : acc),
            [],
        );

        if (artistType === ArtistType.trackArtists || artistType === ArtistType.allArtists) {
            this.addTracksForTrackOrAllArtists(sourceArtists, trackModels);
        }

        if (artistType === ArtistType.albumArtists || artistType === ArtistType.allArtists) {
            this.addTracksForAlbumOrAllArtists(sourceArtists, trackModels);
        }

        return trackModels;
    }

    private addTracksForTrackOrAllArtists(artists: string[], trackModels: TrackModels): void {
        const trackArtistTracks: Track[] = this.trackRepository.getTracksForTrackArtists(artists) ?? [];

        for (const track of trackArtistTracks) {
            const trackModel: TrackModel = this.trackModelFactory.createFromTrack(track);
            trackModels.addTrack(trackModel);
        }
    }

    private addTracksForAlbumOrAllArtists(artists: string[], trackModels: TrackModels): void {
        const albumArtistTracks: Track[] = this.trackRepository.getTracksForAlbumArtists(artists) ?? [];

        for (const track of albumArtistTracks) {
            const trackModel: TrackModel = this.trackModelFactory.createFromTrack(track);

            // Avoid adding a track twice
            // TODO: can this be done better?
            if (!trackModels.tracks.map((x) => x.path).includes(trackModel.path)) {
                trackModels.addTrack(trackModel);
            }
        }
    }

    public getTracksForGenres(genres: string[]): TrackModels {
        const trackModels: TrackModels = new TrackModels();

        if (genres.length === 0) {
            return trackModels;
        }

        const tracks: Track[] = this.trackRepository.getTracksForGenres(genres) ?? [];

        for (const track of tracks) {
            const trackModel: TrackModel = this.trackModelFactory.createFromTrack(track);
            trackModels.addTrack(trackModel);
        }

        return trackModels;
    }

    public savePlayCountAndDateLastPlayed(track: TrackModel): void {
        this.trackRepository.updatePlayCountAndDateLastPlayed(track.id, track.playCount, track.dateLastPlayed);
    }

    public saveSkipCount(track: TrackModel): void {
        this.trackRepository.updateSkipCount(track.id, track.skipCount);
    }
}
