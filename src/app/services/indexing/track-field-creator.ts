import { Injectable } from '@angular/core';
import { DataDelimiter } from '../../data/data-delimiter';
import { MetadataPatcher } from '../../metadata/metadata-patcher';

@Injectable({
    providedIn: 'root'
})
export class TrackFieldCreator {
    constructor(private metadataPatcher: MetadataPatcher, private dataDelimiter: DataDelimiter) {

    }

    public convertToSingleValueField(value: string): string {
        if (!value) {
            return '';
        }

        return value.trim();
    }

    public convertToMultiValueField(valueArray: string[]): string {
        return this.dataDelimiter.convertToDelimitedString(
            this.metadataPatcher.joinUnsplittableMetadata(valueArray)
        );
    }
}
