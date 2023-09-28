import * as mm from 'music-metadata';
import { IAudioMetadata } from 'music-metadata';
import { IFileMetadata } from './i-file-metadata';

export class MusicMetadataFileMetadata implements IFileMetadata {
    public constructor(public path: string) {}

    public bitRate: number = 0;
    public sampleRate: number = 0;
    public durationInMilliseconds: number = 0;
    public title: string = '';
    public album: string = '';
    public albumArtists: string[] = [];
    public artists: string[] = [];
    public genres: string[] = [];
    public comment: string = '';
    public grouping: string = '';
    public year: number = 0;
    public trackNumber: number = 0;
    public trackCount: number = 0;
    public discNumber: number = 0;
    public discCount: number = 0;
    public lyrics: string = '';
    public picture: Buffer | undefined;
    public rating: number = 0;

    public save(): void {
        // Do nothing
    }

    public async loadAsync(): Promise<void> {
        const audioMetadata: IAudioMetadata = await mm.parseFile(this.path);

        if (audioMetadata == undefined) {
            return;
        }

        if (audioMetadata.format == undefined) {
            return;
        }

        if (audioMetadata.format.bitrate != undefined && !Number.isNaN(audioMetadata.format.bitrate)) {
            this.bitRate = audioMetadata.format.bitrate ?? 0;
        }

        if (audioMetadata.format.sampleRate != undefined && !Number.isNaN(audioMetadata.format.sampleRate)) {
            this.sampleRate = audioMetadata.format.sampleRate ?? 0;
        }

        if (audioMetadata.format.duration != undefined && !Number.isNaN(audioMetadata.format.duration)) {
            this.durationInMilliseconds = (audioMetadata.format.duration ?? 0) * 1000;
        }

        if (audioMetadata.common == undefined) {
            return;
        }

        if (audioMetadata.common.title != undefined) {
            this.title = audioMetadata.common.title ?? '';
        }

        if (audioMetadata.common.album != undefined) {
            this.album = audioMetadata.common.album ?? '';
        }

        if (audioMetadata.common.albumartist != undefined) {
            this.albumArtists = [audioMetadata.common.albumartist] ?? [];
        }

        if (audioMetadata.common.artists != undefined) {
            this.artists = audioMetadata.common.artists ?? [];
        }

        if (audioMetadata.common.genre != undefined) {
            this.genres = audioMetadata.common.genre ?? [];
        }

        if (audioMetadata.common.comment != undefined && audioMetadata.common.comment.length > 0) {
            this.comment = audioMetadata.common.comment[0] ?? '';
        }

        if (audioMetadata.common.grouping != undefined && audioMetadata.common.grouping.length > 0) {
            this.grouping = audioMetadata.common.grouping[0] ?? '';
        }

        if (audioMetadata.common.year != undefined && !Number.isNaN(audioMetadata.common.year)) {
            this.year = audioMetadata.common.year ?? 0;
        }

        if (audioMetadata.common.track != undefined) {
            if (audioMetadata.common.track.no != undefined && !Number.isNaN(audioMetadata.common.track.no)) {
                this.trackNumber = audioMetadata.common.track.no ?? 0;
            }

            if (audioMetadata.common.track.of != undefined && !Number.isNaN(audioMetadata.common.track.of)) {
                this.trackCount = audioMetadata.common.track.of ?? 0;
            }
        }

        if (audioMetadata.common.disk != undefined) {
            if (audioMetadata.common.disk.no != undefined && !Number.isNaN(audioMetadata.common.disk.no)) {
                this.discNumber = audioMetadata.common.disk.no ?? 0;
            }

            if (audioMetadata.common.disk.of != undefined && !Number.isNaN(audioMetadata.common.disk.of)) {
                this.discCount = audioMetadata.common.disk.of ?? 0;
            }
        }

        if (audioMetadata.common.rating != undefined && audioMetadata.common.rating.length > 0) {
            this.rating = audioMetadata.common.rating[0].rating ?? 0;
        }

        if (audioMetadata.common.lyrics != undefined && audioMetadata.common.lyrics.length > 0) {
            this.lyrics = audioMetadata.common.lyrics[0] ?? '';
        }

        if (audioMetadata.common.picture != undefined && audioMetadata.common.picture.length > 0) {
            this.picture = audioMetadata.common.picture[0].data;
        }
    }
}
