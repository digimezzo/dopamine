import { Injectable } from '@angular/core';
import { FileFormats } from '../../common/application/file-formats';
import { Track } from '../../common/data/entities/track';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { BaseFileSystem } from '../../common/io/base-file-system';
import { Strings } from '../../common/strings';
import { ArtistType } from '../artist/artist-type';
import { BaseTrackService } from './base-track.service';
import { TrackModel } from './track-model';
import { TrackModelFactory } from './track-model-factory';
import { TrackModels } from './track-models';

@Injectable()
export class TrackService implements BaseTrackService {
    constructor(
        private trackModelFactory: TrackModelFactory,
        private trackRepository: BaseTrackRepository,
        private fileSystem: BaseFileSystem
    ) {}

    public async getTracksInSubfolderAsync(subfolderPath: string): Promise<TrackModels> {
        if (Strings.isNullOrWhiteSpace(subfolderPath)) {
            return new TrackModels();
        }

        const subfolderPathExists: boolean = this.fileSystem.pathExists(subfolderPath);

        if (!subfolderPathExists) {
            return new TrackModels();
        }

        const filesInDirectory: string[] = await this.fileSystem.getFilesInDirectoryAsync(subfolderPath);

        const trackModels: TrackModels = new TrackModels();

        for (const file of filesInDirectory) {
            const fileExtension: string = this.fileSystem.getFileExtension(file);
            const fileExtensionIsSupported: boolean = FileFormats.supportedAudioExtensions.includes(fileExtension.toLowerCase());

            if (fileExtensionIsSupported) {
                const trackModel: TrackModel = await this.trackModelFactory.createFromFileAsync(file);
                trackModels.addTrack(trackModel);
            }
        }

        return trackModels;
    }

    public getAllTracks(): TrackModels {
        const tracks: Track[] = this.trackRepository.getAllTracks();
        const trackModels: TrackModels = new TrackModels();

        for (const track of tracks) {
            const trackModel: TrackModel = this.trackModelFactory.createFromTrack(track);
            trackModels.addTrack(trackModel);
        }

        return trackModels;
    }

    public getTracksForAlbums(albumKeys: string[]): TrackModels {
        const trackModels: TrackModels = new TrackModels();

        if (albumKeys == undefined) {
            return trackModels;
        }

        if (albumKeys.length === 0) {
            return trackModels;
        }

        const tracks: Track[] = this.trackRepository.getTracksForAlbums(albumKeys);

        for (const track of tracks) {
            const trackModel: TrackModel = this.trackModelFactory.createFromTrack(track);
            trackModels.addTrack(trackModel);
        }

        return trackModels;
    }

    public getTracksForArtists(artists: string[], artistType: ArtistType): TrackModels {
        const trackModels: TrackModels = new TrackModels();

        if (artists == undefined) {
            return trackModels;
        }

        if (artists.length === 0) {
            return trackModels;
        }

        if (artistType === ArtistType.trackArtists || artistType === ArtistType.allArtists) {
            const trackArtistTracks: Track[] = this.trackRepository.getTracksForTrackArtists(artists);

            for (const track of trackArtistTracks) {
                const trackModel: TrackModel = this.trackModelFactory.createFromTrack(track);
                trackModels.addTrack(trackModel);
            }
        }

        if (artistType === ArtistType.albumArtists || artistType === ArtistType.allArtists) {
            const albumArtistTracks: Track[] = this.trackRepository.getTracksForAlbumArtists(artists);

            for (const track of albumArtistTracks) {
                const trackModel: TrackModel = this.trackModelFactory.createFromTrack(track);

                // Avoid adding a track twice
                // TODO: can this be done better?
                if (!trackModels.tracks.map((x) => x.path).includes(trackModel.path)) {
                    trackModels.addTrack(trackModel);
                }
            }
        }

        return trackModels;
    }

    public getTracksForGenres(genres: string[]): TrackModels {
        const trackModels: TrackModels = new TrackModels();

        if (genres == undefined) {
            return trackModels;
        }

        if (genres.length === 0) {
            return trackModels;
        }

        const tracks: Track[] = this.trackRepository.getTracksForGenres(genres);

        for (const track of tracks) {
            const trackModel: TrackModel = this.trackModelFactory.createFromTrack(track);
            trackModels.addTrack(trackModel);
        }

        return trackModels;
    }

    public savePlayCount(track: TrackModel): void {
        this.trackRepository.updatePlayCount(track.id, track.playCount);
    }

    public saveSkipCount(track: TrackModel): void {
        this.trackRepository.updateSkipCount(track.id, track.skipCount);
    }
}
