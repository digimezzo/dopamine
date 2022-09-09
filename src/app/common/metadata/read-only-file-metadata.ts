import { File } from 'node-taglib-sharp';
import { FileMetadata } from './file-metadata';
export class ReadOnlyFileMetadata implements FileMetadata {
    private constructor(public path: string) {}

    public bitRate: number;
    public sampleRate: number;
    public durationInMilliseconds: number;
    public title: string;
    public album: string;
    public albumArtists: string[];
    public artists: string[];
    public genres: string[];
    public comment: string;
    public grouping: string;
    public year: number;
    public trackNumber: number;
    public trackCount: number;
    public discNumber: number;
    public discCount: number;
    public rating: number;
    public lyrics: string;
    public picture: Buffer;

    public static async createAsync(path: string): Promise<ReadOnlyFileMetadata> {
        const readOnlyFileMetadata: ReadOnlyFileMetadata = new ReadOnlyFileMetadata(path);
        await readOnlyFileMetadata.readFileMetadataAsync();

        return readOnlyFileMetadata;
    }

    private async readFileMetadataAsync(): Promise<void> {
        const tagLibFile = File.createFromPath(this.path);

        if (tagLibFile.tag != undefined) {
            if (tagLibFile.tag.performers != undefined) {
                this.artists = tagLibFile.tag.performers;
            }

            if (tagLibFile.tag.title != undefined) {
                this.title = tagLibFile.tag.title;
            }

            if (tagLibFile.tag.album != undefined) {
                this.album = tagLibFile.tag.album;
            }

            if (tagLibFile.tag.albumArtists != undefined) {
                this.albumArtists = tagLibFile.tag.albumArtists;
            }

            if (tagLibFile.tag.genres != undefined) {
                this.genres = tagLibFile.tag.genres;
            }

            if (tagLibFile.tag.year != undefined && !Number.isNaN(tagLibFile.tag.year)) {
                this.year = tagLibFile.tag.year;
            }

            if (tagLibFile.tag.comment != undefined) {
                this.comment = tagLibFile.tag.comment;
            }

            if (tagLibFile.tag.grouping != undefined) {
                this.grouping = tagLibFile.tag.grouping;
            }

            if (tagLibFile.tag.track != undefined && !Number.isNaN(tagLibFile.tag.track)) {
                this.trackNumber = tagLibFile.tag.track;
            }

            if (tagLibFile.tag.trackCount != undefined && !Number.isNaN(tagLibFile.tag.trackCount)) {
                this.trackCount = tagLibFile.tag.trackCount;
            }

            if (tagLibFile.tag.disc != undefined && !Number.isNaN(tagLibFile.tag.disc)) {
                this.discNumber = tagLibFile.tag.disc;
            }

            if (tagLibFile.tag.discCount != undefined && !Number.isNaN(tagLibFile.tag.discCount)) {
                this.discCount = tagLibFile.tag.discCount;
            }

            if (tagLibFile.tag.lyrics != undefined) {
                this.lyrics = tagLibFile.tag.lyrics;
            }

            if (tagLibFile.tag.pictures != undefined && tagLibFile.tag.pictures.length > 0) {
                let couldGetPicture: boolean = false;

                for (const picture of tagLibFile.tag.pictures) {
                    if (!couldGetPicture) {
                        try {
                            this.picture = Buffer.from(picture.data.toBase64String(), 'base64');
                            couldGetPicture = true;
                        } catch (error) {}
                    }
                }
            }
        }

        if (tagLibFile.properties != undefined) {
            if (tagLibFile.properties.durationMilliseconds != undefined && !Number.isNaN(tagLibFile.properties.durationMilliseconds)) {
                this.durationInMilliseconds = tagLibFile.properties.durationMilliseconds;
            }

            if (tagLibFile.properties.audioBitrate != undefined && !Number.isNaN(tagLibFile.properties.audioBitrate)) {
                this.bitRate = tagLibFile.properties.audioBitrate;
            }

            if (tagLibFile.properties.audioSampleRate != undefined && !Number.isNaN(tagLibFile.properties.audioSampleRate)) {
                this.sampleRate = tagLibFile.properties.audioSampleRate;
            }
        }

        this.rating = 0; // TODO
    }
}
