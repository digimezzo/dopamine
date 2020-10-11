import * as mm from 'music-metadata';
import { IAudioMetadata } from 'music-metadata';
import { ConfirmThat } from '../core/confirm-that';
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

        if (ConfirmThat.isNull(audioMetadata)) {
            return;
        }

        if (ConfirmThat.isNull(audioMetadata.format)) {
            return;
        }

        if (ConfirmThat.isNotNull(audioMetadata.format.bitrate)) {
            this.bitRate = audioMetadata.format.bitrate;
        }

        if (ConfirmThat.isNotNull(audioMetadata.format.sampleRate)) {
            this.sampleRate = audioMetadata.format.sampleRate;
        }

        if (ConfirmThat.isNotNull(audioMetadata.format.duration)) {
            this.duration = audioMetadata.format.duration;
        }

        if (ConfirmThat.isNull(audioMetadata.common)) {
            return;
        }

        if (ConfirmThat.isNotNullOrWhiteSpace(audioMetadata.common.title)) {
            this.title = audioMetadata.common.title;
        }

        if (ConfirmThat.isNotNullOrWhiteSpace(audioMetadata.common.album)) {
            this.album = audioMetadata.common.album;
        }

        if (ConfirmThat.isNotNullOrWhiteSpace(audioMetadata.common.albumartist)) {
            this.albumArtists = [audioMetadata.common.albumartist];
        }

        if (ConfirmThat.isNotNull(audioMetadata.common.artists)) {
            this.artists = audioMetadata.common.artists;
        }

        if (ConfirmThat.isNotNull(audioMetadata.common.genre)) {
            this.genres = audioMetadata.common.genre;
        }

        if (ConfirmThat.isNotNull(audioMetadata.common.comment)) {
            if (audioMetadata.common.comment.length > 0) {
                this.comment = audioMetadata.common.comment[0];
            }
        }

        if (ConfirmThat.isNotNull(audioMetadata.common.grouping)) {
            if (audioMetadata.common.grouping.length > 0) {
                this.grouping = audioMetadata.common.grouping[0];
            }
        }

        if (ConfirmThat.isNotNull(audioMetadata.common.year)) {
            this.year = audioMetadata.common.year;
        }

        if (ConfirmThat.isNotNull(audioMetadata.common.track)) {
            if (ConfirmThat.isNotNull(audioMetadata.common.track.no)) {
                this.trackNumber = audioMetadata.common.track.no;
            }

            if (ConfirmThat.isNotNull(audioMetadata.common.track.of)) {
                this.trackCount = audioMetadata.common.track.of;
            }
        }

        if (ConfirmThat.isNotNull(audioMetadata.common.disk)) {
            if (ConfirmThat.isNotNull(audioMetadata.common.disk.no)) {
                this.discNumber = audioMetadata.common.disk.no;
            }

            if (ConfirmThat.isNotNull(audioMetadata.common.disk.of)) {
                this.discCount = audioMetadata.common.disk.of;
            }
        }

        if (ConfirmThat.isNotNull(audioMetadata.common.rating) && audioMetadata.common.rating.length > 0) {
            this.rating = audioMetadata.common.rating[0].rating;
        }

        if (ConfirmThat.isNotNull(audioMetadata.common.lyrics) && audioMetadata.common.lyrics.length > 0) {
            this.lyrics = audioMetadata.common.lyrics[0];
        }

        if (ConfirmThat.isNotNull(audioMetadata.common.picture) && audioMetadata.common.picture.length > 0) {
            this.picture = audioMetadata.common.picture[0].data;
        }
    }
}
