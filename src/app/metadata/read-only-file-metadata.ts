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

        if (!audioMetadata) {
            return;
        }

        if (!audioMetadata.format) {
            return;
        }

        if (audioMetadata.format.bitrate) {
            this.bitRate = audioMetadata.format.bitrate;
        }

        if (audioMetadata.format.sampleRate) {
            this.sampleRate = audioMetadata.format.sampleRate;
        }

        if (audioMetadata.format.duration) {
            this.duration = audioMetadata.format.duration;
        }

        if (!audioMetadata.common) {
            return;
        }

        if (audioMetadata.common.title) {
            this.title = audioMetadata.common.title;
        }

        if (audioMetadata.common.album) {
            this.album = audioMetadata.common.album;
        }

        if (audioMetadata.common.albumartist) {
            this.albumArtists = [audioMetadata.common.albumartist];
        }

        if (audioMetadata.common.artists) {
            this.artists = audioMetadata.common.artists;
        }

        if (audioMetadata.common.genre) {
            this.genres = audioMetadata.common.genre;
        }

        if (audioMetadata.common.comment) {
            if (audioMetadata.common.comment.length > 0) {
                this.comment = audioMetadata.common.comment[0];
            }
        }

        if (audioMetadata.common.grouping) {
            if (audioMetadata.common.grouping.length > 0) {
                this.grouping = audioMetadata.common.grouping[0];
            }
        }

        if (audioMetadata.common.year) {
            this.year = audioMetadata.common.year;
        }

        if (audioMetadata.common.track) {
            if (audioMetadata.common.track.no) {
                this.trackNumber = audioMetadata.common.track.no;
            }

            if (audioMetadata.common.track.of) {
                this.trackCount = audioMetadata.common.track.of;
            }
        }

        if (audioMetadata.common.disk) {
            if (audioMetadata.common.disk.no) {
                this.discNumber = audioMetadata.common.disk.no;
            }

            if (audioMetadata.common.disk.of) {
                this.discCount = audioMetadata.common.disk.of;
            }
        }

        if (audioMetadata.common.rating) {
            if (audioMetadata.common.rating.length > 0) {
                this.rating = audioMetadata.common.rating[0].rating;
            }
        }

        if (audioMetadata.common.lyrics) {
            if (audioMetadata.common.lyrics.length > 0) {
                this.lyrics = audioMetadata.common.lyrics[0];
            }
        }

        if (audioMetadata.common.picture) {
            if (audioMetadata.common.picture.length > 0) {
                this.picture = audioMetadata.common.picture[0].data;
            }
        }
    }
}
