import { Strings } from '../../core/strings';
import { AlbumData } from '../../data/album-data';
import { DataDelimiter } from '../../data/data-delimiter';
import { BaseTranslatorService } from '../translator/base-translator.service';

export class AlbumModel {
    constructor(private albumData: AlbumData, private translatorService: BaseTranslatorService) {}

    public isSelected: boolean = false;
    public artworkPath: string;
    public showYear: boolean = false;
    public yearHeader: string = '';

    public get albumArtist(): string {
        const albumArtists = DataDelimiter.fromDelimitedString(this.albumData.albumArtists);

        if (albumArtists != undefined && albumArtists.length > 0) {
            return albumArtists[0];
        }

        const trackArtists = DataDelimiter.fromDelimitedString(this.albumData.artists);

        if (trackArtists != undefined && trackArtists.length > 0) {
            return trackArtists[0];
        }

        return this.translatorService.get('Album.UnknownArtist');
    }

    public get albumTitle(): string {
        if (Strings.isNullOrWhiteSpace(this.albumData.albumTitle)) {
            return this.translatorService.get('Album.UnknownTitle');
        }

        return this.albumData.albumTitle;
    }

    public get year(): number {
        return this.albumData.year;
    }

    public get albumKey(): string {
        return this.albumData.albumKey;
    }

    public get dateAddedInTicks(): number {
        return this.albumData.dateAdded;
    }

    public get dateFileCreatedInTicks(): number {
        return this.albumData.dateFileCreated;
    }

    public get dateLastPlayedInTicks(): number {
        return this.albumData.dateLastPlayed;
    }
}
