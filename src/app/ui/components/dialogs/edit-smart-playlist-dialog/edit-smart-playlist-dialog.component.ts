import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlaylistData } from '../../../../services/dialog/playlist-data';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { StringUtils } from '../../../../common/utils/string-utils';

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
    ) {
        dialogRef.disableClose = true;
    }

    public playlistName: string = '';
    public playlistImagePath: string = '';
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

    public get dialogTitle(): string {
        if (this.hasPlaylistName) {
            return this.translatorService.get('edit-smart-playlist');
        }

        return this.translatorService.get('create-smart-playlist');
    }

    public get hasPlaylistName(): boolean {
        return !StringUtils.isNullOrWhiteSpace(this.playlistName);
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

    private async updatePlaylistAsync(): Promise<void> {
        try {
            // await this.playlistService.updatePlaylistDetailsAsync(this.data.playlist, this.playlistName, this.playlistImagePath);
        } catch (e: unknown) {
            // TODO
        }
    }
}
