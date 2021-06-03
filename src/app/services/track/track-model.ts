import { StringCompare } from '../../core/string-compare';
import { DataDelimiter } from '../../data/data-delimiter';
import { Track } from '../../data/entities/track';
import { BaseTranslatorService } from '../translator/base-translator.service';

export class TrackModel {
    constructor(private track: Track, private translatorService: BaseTranslatorService) {}

    public isPlaying: boolean = false;
    public isSelected: boolean = false;
    public showHeader: boolean = false;

    public get path(): string {
        return this.track.path;
    }

    public get fileName(): string {
        return this.track.fileName;
    }

    public get number(): number {
        return this.track.trackNumber;
    }

    public get title(): string {
        return this.track.trackTitle;
    }

    public get artists(): string[] {
        return DataDelimiter.fromDelimitedString(this.track.artists);
    }

    public get albumKey(): string {
        return this.track.albumKey;
    }

    public get albumTitle(): string {
        if (StringCompare.isNullOrWhiteSpace(this.track.albumTitle)) {
            return this.translatorService.get('Track.UnknownAlbum');
        }

        return this.track.albumTitle;
    }

    public get albumArtist(): string {
        const albumArtists = DataDelimiter.fromDelimitedString(this.track.albumArtists);

        if (albumArtists != undefined && albumArtists.length > 0) {
            return albumArtists[0];
        }

        const trackArtists = DataDelimiter.fromDelimitedString(this.track.artists);

        if (trackArtists != undefined && trackArtists.length > 0) {
            return trackArtists[0];
        }

        return this.translatorService.get('Track.UnknownArtist');
    }

    public get durationInMilliseconds(): number {
        return this.track.duration;
    }

    public get fileSizeInBytes(): number {
        return this.track.fileSize;
    }
}
