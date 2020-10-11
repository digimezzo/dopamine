import { Injectable } from '@angular/core';
import { DataDelimiter } from '../../data/data-delimiter';
import { MetadataPatcher } from '../../metadata/metadata-patcher';

@Injectable({
    providedIn: 'root'
})
export class TrackFieldCreator {
    constructor(private metadataPatcher: MetadataPatcher, private dataDelimiter: DataDelimiter) {

    }

    public createNumberField(value: number): number {
        if (!value) {
            return 0;
        }

        return value;
        return value;
    }

    public createTextField(value: string): string {
        if (!value) {
            return '';
        }

        return value.trim();
    }

    public createMultiTextField(valueArray: string[]): string {
        if (!valueArray) {
            return '';
        }

        return this.dataDelimiter.convertToDelimitedString(
            this.metadataPatcher.joinUnsplittableMetadata(valueArray)
        );
    }
}
