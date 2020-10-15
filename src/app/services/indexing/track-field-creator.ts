import { Injectable } from '@angular/core';
import { DataDelimiter } from '../../data/data-delimiter';
import { MetadataPatcher } from '../../metadata/metadata-patcher';

@Injectable()
export class TrackFieldCreator {
    constructor(private metadataPatcher: MetadataPatcher, private dataDelimiter: DataDelimiter) {
    }

    public createNumberField(value: number): number {
        if (value === null || value === undefined || Number.isNaN(value)) {
            return 0;
        }

        return value;
    }

    public createTextField(value: string): string {
        if (value === null || value === undefined) {
            return '';
        }

        return value.trim();
    }

    public createMultiTextField(valueArray: string[]): string {
        if (valueArray === null || valueArray === undefined) {
            return '';
        }

        return this.dataDelimiter.convertToDelimitedString(
            this.metadataPatcher.joinUnsplittableMetadata(valueArray)
        );
    }
}
