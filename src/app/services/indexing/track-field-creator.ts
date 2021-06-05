import { Injectable } from '@angular/core';
import { DataDelimiter } from '../../common/data/data-delimiter';
import { MetadataPatcher } from '../../common/metadata/metadata-patcher';

@Injectable()
export class TrackFieldCreator {
    constructor(private metadataPatcher: MetadataPatcher) {}

    public createNumberField(value: number): number {
        if (value == undefined || Number.isNaN(value)) {
            return 0;
        }

        return value;
    }

    public createTextField(value: string): string {
        if (value == undefined) {
            return '';
        }

        return value.trim();
    }

    public createMultiTextField(valueArray: string[]): string {
        if (valueArray == undefined) {
            return '';
        }

        return DataDelimiter.toDelimitedString(this.metadataPatcher.joinUnsplittableMetadata(valueArray));
    }
}
