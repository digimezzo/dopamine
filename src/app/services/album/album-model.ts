import { AlbumData } from '../../data/album-data';
import { DataDelimiter } from '../../data/data-delimiter';

export class AlbumModel {
    constructor(private albumData: AlbumData) {}

    public get albumArtists(): string[] {
        return DataDelimiter.fromDelimitedString(this.albumData.albumArtists);
    }

    public get artists(): string[] {
        return DataDelimiter.fromDelimitedString(this.albumData.artists);
    }

    public get albumTitle(): string {
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
}
