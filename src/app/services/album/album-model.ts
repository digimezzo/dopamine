import { Constants } from '../../common/application/constants';
import { DataDelimiter } from '../../common/data/data-delimiter';
import { AlbumData } from '../../common/data/entities/album-data';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { Strings } from '../../common/strings';
import { ISelectable } from '../../interfaces/i-selectable';
import { BaseTranslatorService } from '../translator/base-translator.service';

export class AlbumModel implements ISelectable {
    public constructor(
        private albumData: AlbumData,
        private translatorService: BaseTranslatorService,
        private fileAccess: BaseFileAccess
    ) {}

    public isSelected: boolean = false;
    public showYear: boolean = false;
    public yearHeader: string = '';

    public get artworkPath(): string {
        if (Strings.isNullOrWhiteSpace(this.albumData.artworkId)) {
            return Constants.emptyImage;
        }

        return 'file:///' + this.fileAccess.coverArtFullPath(this.albumData.artworkId!);
    }

    public get albumArtist(): string {
        const albumArtists = DataDelimiter.fromDelimitedString(this.albumData.albumArtists);

        if (albumArtists != undefined && albumArtists.length > 0) {
            return albumArtists[0];
        }

        const trackArtists = DataDelimiter.fromDelimitedString(this.albumData.artists);

        if (trackArtists != undefined && trackArtists.length > 0) {
            return trackArtists[0];
        }

        return this.translatorService.get('unknown-artist');
    }

    public get albumTitle(): string {
        if (Strings.isNullOrWhiteSpace(this.albumData.albumTitle)) {
            return this.translatorService.get('unknown-title');
        }

        return this.albumData.albumTitle!;
    }

    public get year(): number {
        return this.albumData.year ?? 0;
    }

    public get albumKey(): string {
        return this.albumData.albumKey ?? '';
    }

    public get dateAddedInTicks(): number {
        return this.albumData.dateAdded ?? 0;
    }

    public get dateFileCreatedInTicks(): number {
        return this.albumData.dateFileCreated ?? 0;
    }

    public get dateLastPlayedInTicks(): number {
        return this.albumData.dateLastPlayed ?? 0;
    }
}
