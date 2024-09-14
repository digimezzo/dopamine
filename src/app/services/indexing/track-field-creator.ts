import { Injectable } from '@angular/core';
import { DataDelimiter } from '../../data/data-delimiter';
import { MetadataPatcher } from '../../common/metadata/metadata-patcher';

@Injectable()
export class TrackFieldCreator {
    public constructor() {}

    public createNumberField(value: number | undefined): number {
        if (value == undefined || Number.isNaN(value)) {
            return 0;
        }

        return value;
    }

    public createTextField(value: string | undefined): string {
        if (value == undefined) {
            return '';
        }

        return value.trim();
    }

    public createMultiTextField(valueArray: string[] | undefined): string {
        if (valueArray == undefined) {
            return '';
        }

        return DataDelimiter.toDelimitedString(valueArray);
    }
}
