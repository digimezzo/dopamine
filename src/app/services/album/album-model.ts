import { Constants } from '../../common/application/constants';
import { DataDelimiter } from '../../data/data-delimiter';
import { AlbumData } from '../../data/entities/album-data';
import { StringUtils } from '../../common/utils/string-utils';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { ISelectable } from '../../ui/interfaces/i-selectable';
import { ApplicationPaths } from '../../common/application/application-paths';

export class AlbumModel implements ISelectable {
    public constructor(
        private albumData: AlbumData,
        private translatorService: TranslatorServiceBase,
        private applicationPaths: ApplicationPaths,
    ) {}

    public isSelected: boolean = false;
    public showYear: boolean = false;
    public yearHeader: string = '';

    public get artworkPath(): string {
        if (StringUtils.isNullOrWhiteSpace(this.albumData.artworkId)) {
            return Constants.emptyImage;
        }

        return 'file:///' + this.applicationPaths.coverArtFullPath(this.albumData.artworkId!);
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
        if (StringUtils.isNullOrWhiteSpace(this.albumData.albumTitle)) {
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
