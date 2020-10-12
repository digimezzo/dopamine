import * as mm from 'music-metadata';
import { IAudioMetadata } from 'music-metadata';
import { FileMetadata } from './file-metadata';

export class ReadOnlyFileMetadata implements FileMetadata {
    private constructor(public path: string) {
    }

    public bitRate: number;
    public sampleRate: number;
    public duration: number;
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
        const audioMetadata: IAudioMetadata = await mm.parseFile(this.path);

        if (audioMetadata === null || audioMetadata === undefined) {
            return;
        }

        if (audioMetadata.format === null || audioMetadata.format === undefined) {
            return;
        }

        if (audioMetadata.format.bitrate !== null && audioMetadata.format.bitrate !== undefined) {
            this.bitRate = audioMetadata.format.bitrate;
        }

        if (audioMetadata.format.sampleRate !== null && audioMetadata.format.sampleRate !== undefined) {
            this.sampleRate = audioMetadata.format.sampleRate;
        }

        if (audioMetadata.format.duration !== null && audioMetadata.format.duration !== undefined) {
            this.duration = audioMetadata.format.duration;
        }

        if (audioMetadata.common === null || audioMetadata.common === undefined) {
            return;
        }

        if (audioMetadata.common.title !== null && audioMetadata.common.title !== undefined) {
            this.title = audioMetadata.common.title;
        }

        if (audioMetadata.common.album !== null && audioMetadata.common.album !== undefined) {
            this.album = audioMetadata.common.album;
        }

        if (audioMetadata.common.albumartist !== null && audioMetadata.common.albumartist !== undefined) {
            this.albumArtists = [audioMetadata.common.albumartist];
        }

        if (audioMetadata.common.artists !== null && audioMetadata.common.artists !== undefined) {
            this.artists = audioMetadata.common.artists;
        }

        if (audioMetadata.common.genre !== null && audioMetadata.common.genre !== undefined) {
            this.genres = audioMetadata.common.genre;
        }

        if (audioMetadata.common.comment !== null && audioMetadata.common.comment !== undefined) {
            if (audioMetadata.common.comment.length > 0) {
                this.comment = audioMetadata.common.comment[0];
            }
        }

        if (audioMetadata.common.grouping !== null && audioMetadata.common.grouping !== undefined) {
            if (audioMetadata.common.grouping.length > 0) {
                this.grouping = audioMetadata.common.grouping[0];
            }
        }

        if (audioMetadata.common.year !== null && audioMetadata.common.year !== undefined) {
            this.year = audioMetadata.common.year;
        }

        if (audioMetadata.common.track !== null && audioMetadata.common.track !== undefined) {
            if (audioMetadata.common.track.no !== null && audioMetadata.common.track.no !== undefined) {
                this.trackNumber = audioMetadata.common.track.no;
            }

            if (audioMetadata.common.track.of !== null && audioMetadata.common.track.of !== undefined) {
                this.trackCount = audioMetadata.common.track.of;
            }
        }

        if (audioMetadata.common.disk !== null && audioMetadata.common.disk !== undefined) {
            if (audioMetadata.common.disk.no !== null && audioMetadata.common.disk.no !== undefined) {
                this.discNumber = audioMetadata.common.disk.no;
            }

            if (audioMetadata.common.disk.of !== null && audioMetadata.common.disk.of !== undefined) {
                this.discCount = audioMetadata.common.disk.of;
            }
        }

        if (audioMetadata.common.rating !== null && audioMetadata.common.rating !== undefined) {
            if (audioMetadata.common.rating.length > 0) {
                this.rating = audioMetadata.common.rating[0].rating;
            }
        }

        if (audioMetadata.common.lyrics !== null && audioMetadata.common.lyrics !== undefined) {
            if (audioMetadata.common.lyrics.length > 0) {
                this.lyrics = audioMetadata.common.lyrics[0];
            }
        }

        if (audioMetadata.common.picture !== null && audioMetadata.common.picture !== undefined) {
            if (audioMetadata.common.picture.length > 0) {
                this.picture = audioMetadata.common.picture[0].data;
            }
        }
    }
}
