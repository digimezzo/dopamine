import { Injectable } from '@angular/core';
import { ConfirmThat } from '../../core/confirm-that';
import { DataDelimiter } from '../../data/data-delimiter';
import { MetadataPatcher } from '../../metadata/metadata-patcher';

@Injectable({
    providedIn: 'root'
})
export class TrackFieldCreator {
    constructor(private metadataPatcher: MetadataPatcher, private dataDelimiter: DataDelimiter) {

    }

    public createNumberField(value: number): number {
        if (ConfirmThat.isNull(value)) {
            return 0;
        }

        return value;
    }

    public createTextField(value: string): string {
        if (ConfirmThat.isNullOrWhiteSpace(value)) {
            return '';
        }

        return value.trim();
    }

    public createMultiTextField(valueArray: string[]): string {
        if (ConfirmThat.isNull(valueArray)) {
            return '';
        }

        return this.dataDelimiter.convertToDelimitedString(
            this.metadataPatcher.joinUnsplittableMetadata(valueArray)
        );
    }
}
