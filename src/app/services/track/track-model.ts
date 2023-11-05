import { DataDelimiter } from '../../data/data-delimiter';
import { Track } from '../../data/entities/track';
import { DateTime } from '../../common/date-time';
import { Strings } from '../../common/strings';
import { ISelectable } from '../../interfaces/i-selectable';
import { TranslatorServiceBase } from '../translator/translator.service.base';

export class TrackModel implements ISelectable {
    public constructor(
        private track: Track,
        private dateTime: DateTime,
        private translatorService: TranslatorServiceBase,
    ) {}

    public isPlaying: boolean = false;
    public isSelected: boolean = false;
    public showHeader: boolean = false;

    public playlistPath: string = '';

    public get id(): number {
        return this.track.trackId;
    }

    public get path(): string {
        return this.track.path;
    }

    public get fileName(): string {
        return this.track.fileName ?? '';
    }

    public get number(): number {
        return this.track.trackNumber ?? 0;
    }

    public get discNumber(): number {
        return this.track.discNumber ?? 0;
    }

    public get discCount(): number {
        return this.track.discCount ?? 0;
    }

    public get year(): number {
        return this.track.year ?? 0;
    }

    public get title(): string {
        if (!Strings.isNullOrWhiteSpace(this.track.trackTitle)) {
            return this.track.trackTitle!;
        }

        return this.track.fileName;
    }

    public get rawTitle(): string {
        if (Strings.isNullOrWhiteSpace(this.track.trackTitle)) {
            return '';
        }

        return this.track.trackTitle!;
    }

    public get sortableTitle(): string {
        return Strings.getSortableString(this.title, false);
    }

    public get artists(): string {
        const trackArtists: string[] = DataDelimiter.fromDelimitedString(this.track.artists);

        if (trackArtists == undefined || trackArtists.length === 0) {
            return this.translatorService.get('unknown-artist');
        }

        const commaSeparatedArtists: string = trackArtists.filter((x) => !Strings.isNullOrWhiteSpace(x)).join(', ');

        if (commaSeparatedArtists.length === 0) {
            return this.translatorService.get('unknown-artist');
        }

        return commaSeparatedArtists;
    }

    public get rawArtists(): string[] {
        const trackArtists: string[] = DataDelimiter.fromDelimitedString(this.track.artists);

        if (trackArtists == undefined) {
            return [];
        }

        const nonEmptyArtists: string[] = trackArtists.filter((x) => !Strings.isNullOrWhiteSpace(x));

        return nonEmptyArtists;
    }

    public get rawFirstArtist(): string {
        if (this.rawArtists.length === 0) {
            return '';
        }

        const nonEmptyArtists: string[] = this.rawArtists.filter((x) => !Strings.isNullOrWhiteSpace(x));

        return nonEmptyArtists[0];
    }

    public get sortableArtists(): string {
        return Strings.getSortableString(this.artists, false);
    }

    public get genres(): string {
        const trackGenres: string[] = DataDelimiter.fromDelimitedString(this.track.genres);

        if (trackGenres == undefined || trackGenres.length === 0) {
            return this.translatorService.get('unknown-genre');
        }

        const commaSeparatedGenres: string = trackGenres.filter((x) => !Strings.isNullOrWhiteSpace(x)).join(', ');

        if (commaSeparatedGenres.length === 0) {
            return this.translatorService.get('unknown-genre');
        }

        return commaSeparatedGenres;
    }

    public get sortableGenres(): string {
        return Strings.getSortableString(this.genres, false);
    }

    public get albumKey(): string {
        return this.track.albumKey ?? '';
    }

    public get albumTitle(): string {
        if (Strings.isNullOrWhiteSpace(this.track.albumTitle)) {
            return this.translatorService.get('unknown-album');
        }

        return this.track.albumTitle!;
    }

    public get rawAlbumTitle(): string {
        if (Strings.isNullOrWhiteSpace(this.track.albumTitle)) {
            return '';
        }

        return this.track.albumTitle!;
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

        return this.translatorService.get('unknown-artist');
    }

    public get sortableAlbumArtists(): string {
        return Strings.getSortableString(this.albumArtists, false);
    }

    public get sortableAlbumTitle(): string {
        return Strings.getSortableString(this.albumTitle, false);
    }

    public get durationInMilliseconds(): number {
        return this.track.duration ?? 0;
    }

    public get fileSizeInBytes(): number {
        return this.track.fileSize ?? 0;
    }

    public get playCount(): number {
        return this.track.playCount ?? 0;
    }

    public get skipCount(): number {
        return this.track.skipCount ?? 0;
    }

    public get rating(): number {
        return this.track.rating ?? 0;
    }
    public set rating(v: number) {
        this.track.rating = v;
    }

    public get love(): number {
        return this.track.love ?? 0;
    }
    public set love(v: number) {
        this.track.love = v;
    }

    public get dateLastPlayed(): number {
        return this.track.dateLastPlayed ?? 0;
    }

    public get dateAdded(): number {
        return this.track.dateAdded ?? 0;
    }

    public increasePlayCountAndDateLastPlayed(): void {
        if (this.track.playCount == undefined) {
            this.track.playCount = 0;
        }

        this.track.playCount++;
        this.track.dateLastPlayed = this.dateTime.convertDateToTicks(new Date());
    }

    public increaseSkipCount(): void {
        if (this.track.skipCount == undefined) {
            this.track.skipCount = 0;
        }

        this.track.skipCount++;
    }

    public clone(): TrackModel {
        return new TrackModel(this.track, this.dateTime, this.translatorService);
    }
}
