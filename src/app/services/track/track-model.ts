import { DataDelimiter } from '../../data/data-delimiter';
import { Track } from '../../data/entities/track';
import { DateTime } from '../../common/date-time';
import { StringUtils } from '../../common/utils/string-utils';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { ISelectable } from '../../ui/interfaces/i-selectable';
import { CollectionUtils } from '../../common/utils/collections-utils';
import { Constants } from '../../common/application/constants';

export class TrackModel implements ISelectable {
    public constructor(
        private track: Track,
        private dateTime: DateTime,
        private translatorService: TranslatorServiceBase,
        private albumKeyIndex: string,
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
        if (!StringUtils.isNullOrWhiteSpace(this.track.trackTitle)) {
            return this.track.trackTitle!;
        }

        return this.track.fileName;
    }

    public set title(v: string) {
        this.track.trackTitle = v;
    }

    public get rawTitle(): string {
        if (StringUtils.isNullOrWhiteSpace(this.track.trackTitle)) {
            return '';
        }

        return this.track.trackTitle!;
    }

    public get sortableTitle(): string {
        return StringUtils.getSortableString(this.title, false);
    }

    public get artists(): string {
        const trackArtists: string[] = DataDelimiter.fromDelimitedString(this.track.artists);

        if (DataDelimiter.isUnknownValue(trackArtists)) {
            return this.translatorService.get(Constants.unknownArtist);
        }

        const commaSeparatedArtists: string = CollectionUtils.toCommaSeparatedString(trackArtists);

        if (commaSeparatedArtists.length === 0) {
            return this.translatorService.get(Constants.unknownArtist);
        }

        return commaSeparatedArtists;
    }

    public get rawArtists(): string[] {
        const trackArtists: string[] = DataDelimiter.fromDelimitedString(this.track.artists);

        if (DataDelimiter.isUnknownValue(trackArtists)) {
            return [];
        }

        return trackArtists.filter((x) => !StringUtils.isNullOrWhiteSpace(x));
    }

    public get rawFirstArtist(): string {
        if (this.rawArtists.length === 0) {
            return '';
        }

        const nonEmptyArtists: string[] = this.rawArtists.filter((x) => !StringUtils.isNullOrWhiteSpace(x));

        return nonEmptyArtists[0];
    }

    public get sortableArtists(): string {
        return StringUtils.getSortableString(this.artists, false);
    }

    public get genres(): string {
        const trackGenres: string[] = DataDelimiter.fromDelimitedString(this.track.genres);

        if (DataDelimiter.isUnknownValue(trackGenres)) {
            return this.translatorService.get(Constants.unknownGenre);
        }

        const commaSeparatedGenres: string = CollectionUtils.toCommaSeparatedString(trackGenres);

        if (commaSeparatedGenres.length === 0) {
            return this.translatorService.get(Constants.unknownGenre);
        }

        return commaSeparatedGenres;
    }

    public get sortableGenres(): string {
        return StringUtils.getSortableString(this.genres, false);
    }

    public get albumKey(): string {
        if (this.albumKeyIndex === '') {
            return this.track.albumKey ?? '';
        } else if (this.albumKeyIndex === '2') {
            return this.track.albumKey2 ?? '';
        } else if (this.albumKeyIndex === '3') {
            return this.track.albumKey3 ?? '';
        }

        return this.track.albumKey ?? '';
    }

    public get albumTitle(): string {
        if (StringUtils.isNullOrWhiteSpace(this.track.albumTitle)) {
            return this.translatorService.get('unknown-album');
        }

        return this.track.albumTitle!;
    }

    public get rawAlbumTitle(): string {
        if (StringUtils.isNullOrWhiteSpace(this.track.albumTitle)) {
            return '';
        }

        return this.track.albumTitle!;
    }

    public get albumArtists(): string {
        const albumArtists: string[] = DataDelimiter.fromDelimitedString(this.track.albumArtists);

        if (!DataDelimiter.isUnknownValue(albumArtists)) {
            return albumArtists.join(', ');
        }

        const trackArtists: string[] = DataDelimiter.fromDelimitedString(this.track.artists);

        if (!DataDelimiter.isUnknownValue(trackArtists)) {
            return trackArtists.join(', ');
        }

        return this.translatorService.get(Constants.unknownArtist);
    }

    public get sortableAlbumArtists(): string {
        return StringUtils.getSortableString(this.albumArtists, false);
    }

    public get sortableAlbumTitle(): string {
        return StringUtils.getSortableString(this.albumTitle, false);
    }

    public get sortableAlbumProperties(): string {
        return StringUtils.getSortableString(`${this.discNumber}${this.albumKey}${this.number}`, false);
    }

    public get durationInMilliseconds(): number {
        return this.track.duration ?? 0;
    }

    public get fileSizeInBytes(): number {
        return this.track.fileSize ?? 0;
    }

    public get dateCreated(): number {
        return this.track.dateFileCreated ?? 0;
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
        return new TrackModel(this.track, this.dateTime, this.translatorService, this.albumKeyIndex);
    }

    public setTrack(track: Track): void {
        this.track = track;
    }
}
