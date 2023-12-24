const { DataDelimiter } = require('./data-delimiter');
const { MetadataPatcher } = require('./metadata-patcher');

class TrackFieldCreator {
    static createNumberField(value) {
        if (value === undefined || Number.isNaN(value)) {
            return 0;
        }

        return value;
    }

    static createTextField(value) {
        if (value === undefined) {
            return '';
        }

        return value.trim();
    }

    static createMultiTextField(valueArray) {
        if (valueArray === undefined) {
            return '';
        }

        return DataDelimiter.toDelimitedString(MetadataPatcher.joinUnsplittableMetadata(valueArray));
    }
}

exports.TrackFieldCreator = TrackFieldCreator;
