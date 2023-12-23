import { DataDelimiter } from './data-delimiter';
import { MetadataPatcher } from './metadata-patcher';

export class TrackFieldCreator {
    public static createNumberField(value: number | undefined): number {
        if (value == undefined || Number.isNaN(value)) {
            return 0;
        }

        return value;
    }

    public static createTextField(value: string | undefined): string {
        if (value == undefined) {
            return '';
        }

        return value.trim();
    }

    public static createMultiTextField(valueArray: string[] | undefined): string {
        if (valueArray == undefined) {
            return '';
        }

        return DataDelimiter.toDelimitedString(MetadataPatcher.joinUnsplittableMetadata(valueArray));
    }
}
