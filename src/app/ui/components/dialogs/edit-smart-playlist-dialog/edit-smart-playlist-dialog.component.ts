import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlaylistData } from '../../../../services/dialog/playlist-data';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { StringUtils } from '../../../../common/utils/string-utils';
import { PlaylistServiceBase } from '../../../../services/playlist/playlist.service.base';
import { FileAccessBase } from '../../../../common/io/file-access.base';
import { TextSanitizer } from '../../../../common/text-sanitizer';
import { Logger } from '../../../../common/logger';

export type SmartPlaylistFieldType = 'string' | 'number' | 'boolean';

export interface SmartPlaylistField {
    name: string;
    translationKey: string;
    type: SmartPlaylistFieldType;
}

export interface SmartPlaylistOperator {
    name: string;
    translationKey: string;
    types: SmartPlaylistFieldType[];
}

export interface SmartPlaylistFilter {
    field: SmartPlaylistField | undefined;
    operator: SmartPlaylistOperator | undefined;
    value: string;
}

@Component({
    selector: 'app-edit-playlist-dialog',
    templateUrl: './edit-smart-playlist-dialog.component.html',
    styleUrls: ['./edit-smart-playlist-dialog.component.scss'],
})
export class EditSmartPlaylistDialogComponent implements OnInit {
    public constructor(
        @Inject(MAT_DIALOG_DATA) public data: PlaylistData,
        private dialogRef: MatDialogRef<EditSmartPlaylistDialogComponent, boolean>,
        private translatorService: TranslatorServiceBase,
        private playlistService: PlaylistServiceBase,
        private fileAccess: FileAccessBase,
        private textSanitizer: TextSanitizer,
        private logger: Logger,
    ) {
        dialogRef.disableClose = true;
    }

    public playlistName: string = '';
    public playlistImagePath: string = '';
    public matchAnyRule: boolean = false;
    public limitEnabled: boolean = false;
    public limitValue: number = 25;
    public limitUnit: string = 'tracks';
    public limitUnits: { name: string; translationKey: string }[] = [
        { name: 'tracks', translationKey: 'tracks' },
        { name: 'megaBytes', translationKey: 'mega-bytes' },
        { name: 'gigaBytes', translationKey: 'giga-bytes' },
        { name: 'minutes', translationKey: 'minutes' },
    ];
    public filters: SmartPlaylistFilter[] = [];

    public fields: SmartPlaylistField[] = [
        { name: 'artist', translationKey: 'artist', type: 'string' },
        { name: 'albumArtist', translationKey: 'album-artist', type: 'string' },
        { name: 'genre', translationKey: 'genre', type: 'string' },
        { name: 'title', translationKey: 'title', type: 'string' },
        { name: 'albumTitle', translationKey: 'album-title', type: 'string' },
        { name: 'bitrate', translationKey: 'bitrate', type: 'number' },
        { name: 'trackNumber', translationKey: 'track-number', type: 'number' },
        { name: 'trackCount', translationKey: 'track-count', type: 'number' },
        { name: 'discNumber', translationKey: 'disc-number', type: 'number' },
        { name: 'discCount', translationKey: 'disc-count', type: 'number' },
        { name: 'year', translationKey: 'year', type: 'number' },
        { name: 'rating', translationKey: 'rating', type: 'number' },
        { name: 'love', translationKey: 'love', type: 'boolean' },
        { name: 'plays', translationKey: 'plays', type: 'number' },
        { name: 'skips', translationKey: 'skips', type: 'number' },
    ];

    public allOperators: SmartPlaylistOperator[] = [
        { name: 'is', translationKey: 'is', types: ['string', 'number', 'boolean'] },
        { name: 'isNot', translationKey: 'is-not', types: ['string', 'number', 'boolean'] },
        { name: 'contains', translationKey: 'contains', types: ['string'] },
        { name: 'doesNotContain', translationKey: 'does-not-contain', types: ['string'] },
        { name: 'greaterThan', translationKey: 'greater-than', types: ['number'] },
        { name: 'lessThan', translationKey: 'less-than', types: ['number'] },
    ];

    private readonly fieldXmlNames: Record<string, string> = {
        artist: 'artist',
        albumArtist: 'albumartist',
        genre: 'genre',
        title: 'title',
        albumTitle: 'albumtitle',
        bitrate: 'bitrate',
        trackNumber: 'tracknumber',
        trackCount: 'trackcount',
        discNumber: 'discnumber',
        discCount: 'disccount',
        year: 'year',
        rating: 'rating',
        love: 'love',
        plays: 'playcount',
        skips: 'skipcount',
    };

    private readonly operatorXmlNames: Record<string, string> = {
        is: 'is',
        isNot: 'isnot',
        contains: 'contains',
        doesNotContain: 'doesnotcontain',
        greaterThan: 'greaterthan',
        lessThan: 'lessthan',
    };

    private readonly limitUnitXmlNames: Record<string, string> = {
        tracks: 'songs',
        megaBytes: 'MB',
        gigaBytes: 'GB',
        minutes: 'minutes',
    };

    public get dialogTitle(): string {
        if (this.hasPlaylistName) {
            return this.translatorService.get('edit-smart-playlist');
        }

        return this.translatorService.get('create-smart-playlist');
    }

    public get hasPlaylistName(): boolean {
        return !StringUtils.isNullOrWhiteSpace(this.playlistName);
    }

    public get allFiltersHaveValues(): boolean {
        return this.filters.every((f) => !StringUtils.isNullOrWhiteSpace(f.value));
    }

    public get canSave(): boolean {
        return this.hasPlaylistName && this.allFiltersHaveValues;
    }

    public ngOnInit(): void {
        this.dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
            if (result != undefined && result) {
                void this.updatePlaylistAsync();
            }
        });

        this.playlistName = this.data.playlist.name;
        this.playlistImagePath = this.data.playlist.imagePath;
        this.addFilter();
    }

    public getOperatorsForFilter(filter: SmartPlaylistFilter): SmartPlaylistOperator[] {
        if (filter.field == undefined) {
            return [];
        }

        return this.allOperators.filter((op) => op.types.includes(filter.field!.type));
    }

    public onFieldChanged(filter: SmartPlaylistFilter): void {
        const availableOperators = this.getOperatorsForFilter(filter);

        if (filter.operator == undefined || !availableOperators.some((op) => op.name === filter.operator!.name)) {
            filter.operator = availableOperators.length > 0 ? availableOperators[0] : undefined;
        }

        filter.value = '';
    }

    public stars: number[] = [1, 2, 3, 4, 5];

    public onRatingStarClick(filter: SmartPlaylistFilter, starIndex: number): void {
        const newRating = starIndex.toString();
        filter.value = filter.value === newRating ? '0' : newRating;
    }

    public getRatingStarClass(filter: SmartPlaylistFilter, starIndex: number): string {
        const parsed = parseInt(filter.value, 10);
        const rating = isNaN(parsed) ? 0 : parsed;
        return starIndex <= rating ? 'fas fa-star accent-color-important' : 'far fa-star secondary-text';
    }

    public getLoveClass(filter: SmartPlaylistFilter): string {
        switch (filter.value) {
            case '1':
                return 'fas fa-heart accent-color-important';
            case '-1':
                return 'fas fa-heart-crack accent-color-important';
            default:
                return 'far fa-heart secondary-text';
        }
    }

    public toggleLove(filter: SmartPlaylistFilter): void {
        switch (filter.value) {
            case '1':
                filter.value = '-1';
                break;
            case '-1':
                filter.value = '0';
                break;
            default:
                filter.value = '1';
                break;
        }
    }

    public addFilter(): void {
        this.filters.push({ field: this.fields[0], operator: this.allOperators[0], value: '' });
    }

    public removeFilter(index: number): void {
        if (this.filters.length > 1) {
            this.filters.splice(index, 1);
        }
    }

    public compareFields(a: SmartPlaylistField, b: SmartPlaylistField): boolean {
        return a != undefined && b != undefined ? a.name === b.name : a === b;
    }

    public compareOperators(a: SmartPlaylistOperator, b: SmartPlaylistOperator): boolean {
        return a != undefined && b != undefined ? a.name === b.name : a === b;
    }

    private updatePlaylistAsync(): void {
        try {
            const xml = this.generateXml();
            const sanitizedName: string = String(this.textSanitizer.sanitize(this.playlistName));
            const folderPath: string = this.playlistService.activePlaylistFolder.path;
            const fileName: string = sanitizedName + '.dspl';
            const filePath: string = this.fileAccess.combinePath([folderPath, fileName]);

            this.fileAccess.createFullDirectoryPathIfDoesNotExist(folderPath);
            this.fileAccess.writeToFile(filePath, xml);
            this.playlistService.notifyPlaylistsChanged();

            this.logger.info(`Saved smart playlist '${filePath}'`, 'EditSmartPlaylistDialogComponent', 'updatePlaylistAsync');
        } catch (e: unknown) {
            this.logger.error(e, 'Could not save smart playlist', 'EditSmartPlaylistDialogComponent', 'updatePlaylistAsync');
        }
    }

    private generateXml(): string {
        const lines: string[] = [];
        lines.push('<?xml version="1.0" encoding="utf-8"?>');
        lines.push('<smartplaylist>');
        lines.push(`  <name>${this.escapeXml(this.playlistName)}</name>`);
        lines.push(`  <match>${this.matchAnyRule ? 'any' : 'all'}</match>`);

        if (this.limitEnabled) {
            const limitType = this.limitUnitXmlNames[this.limitUnit] ?? 'songs';
            lines.push(`  <limit type="${limitType}">${this.limitValue}</limit>`);
        }

        for (const filter of this.filters) {
            if (filter.field == undefined || filter.operator == undefined) {
                continue;
            }

            const fieldXml = this.fieldXmlNames[filter.field.name] ?? filter.field.name;
            const operatorXml = this.operatorXmlNames[filter.operator.name] ?? filter.operator.name;
            lines.push(`  <rule field="${fieldXml}" operator="${operatorXml}">${this.escapeXml(filter.value)}</rule>`);
        }

        lines.push('</smartplaylist>');
        return lines.join('\n');
    }

    private escapeXml(value: string): string {
        return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    }
}
