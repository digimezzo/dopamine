import { DataDelimiter } from '../../common/data/data-delimiter';
import { Track } from '../../common/data/entities/track';
import { Strings } from '../../common/strings';
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

    public get discNumber(): number {
        return this.track.discNumber;
    }

    public get discCount(): number {
        return this.track.discCount;
    }

    public get title(): string {
        return this.track.trackTitle;
    }

    public get sortableTitle(): string {
        return Strings.getSortableString(this.track.trackTitle, false);
    }

    public get artists(): string[] {
        return DataDelimiter.fromDelimitedString(this.track.artists);
    }

    public get albumKey(): string {
        return this.track.albumKey;
    }

    public get albumTitle(): string {
        if (Strings.isNullOrWhiteSpace(this.track.albumTitle)) {
            return this.translatorService.get('Track.UnknownAlbum');
        }

        return this.track.albumTitle;
    }

    public get albumArtists(): string {
        const albumArtists: string[] = DataDelimiter.fromDelimitedString(this.track.albumArtists);

        if (albumArtists != undefined && albumArtists.length > 0) {
            return albumArtists.join(', ');
        }

        const trackArtists: string[] = DataDelimiter.fromDelimitedString(this.track.artists);

        if (trackArtists != undefined && trackArtists.length > 0) {
            return trackArtists.join(', ');
        }

        return this.translatorService.get('Track.UnknownArtist');
    }

    public get sortableAlbumArtists(): string {
        return Strings.getSortableString(this.albumArtists, false);
    }

    public get sortableAlbumTitle(): string {
        return Strings.getSortableString(this.albumTitle, false);
    }

    public get durationInMilliseconds(): number {
        return this.track.duration;
    }

    public get fileSizeInBytes(): number {
        return this.track.fileSize;
    }
}
