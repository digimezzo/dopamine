import { Injectable } from '@angular/core';
import { FileFormats } from '../../common/application/file-formats';
import { Track } from '../../common/data/entities/track';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { FileSystem } from '../../common/io/file-system';
import { Strings } from '../../common/strings';
import { ArtistType } from '../artist/artist-type';
import { TrackFiller } from '../indexing/track-filler';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { BaseTrackService } from './base-track.service';
import { TrackModel } from './track-model';
import { TrackModels } from './track-models';

@Injectable()
export class TrackService implements BaseTrackService {
    constructor(
        private translatorService: BaseTranslatorService,
        private trackRepository: BaseTrackRepository,
        private fileSystem: FileSystem,
        private trackFiller: TrackFiller
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
            const fileExtensionIsSupported: boolean = FileFormats.supportedAudioExtensions
                .map((x) => x.toLowerCase())
                .includes(fileExtension.toLowerCase());

            if (fileExtensionIsSupported) {
                const track: Track = new Track(file);
                const filledTrack: Track = await this.trackFiller.addFileMetadataToTrackAsync(track);
                const trackModel: TrackModel = new TrackModel(filledTrack, this.translatorService);
                trackModels.addTrack(trackModel);
            }
        }

        return trackModels;
    }

    public getAllTracks(): TrackModels {
        const tracks: Track[] = this.trackRepository.getAllTracks();
        const trackModels: TrackModels = new TrackModels();

        for (const track of tracks) {
            const trackModel: TrackModel = new TrackModel(track, this.translatorService);
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
            const trackModel: TrackModel = new TrackModel(track, this.translatorService);
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
                const trackModel: TrackModel = new TrackModel(track, this.translatorService);
                trackModels.addTrack(trackModel);
            }
        }

        if (artistType === ArtistType.albumArtists || artistType === ArtistType.allArtists) {
            const albumArtistTracks: Track[] = this.trackRepository.getTracksForAlbumArtists(artists);

            for (const track of albumArtistTracks) {
                const trackModel: TrackModel = new TrackModel(track, this.translatorService);
                trackModels.addTrack(trackModel);
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
            const trackModel: TrackModel = new TrackModel(track, this.translatorService);
            trackModels.addTrack(trackModel);
        }

        return trackModels;
    }
}
