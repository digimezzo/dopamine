const { DataDelimiter } = require('./data-delimiter');

class TrackFieldCreator {
    constructor(metadataPatcher) {
        this.metadataPatcher = metadataPatcher;
    }
    createNumberField(value) {
        if (value === undefined || Number.isNaN(value)) {
            return 0;
        }

        return value;
    }

    createTextField(value) {
        if (value === undefined) {
            return '';
        }

        return value.trim();
    }

    createMultiTextField(valueArray) {
        if (valueArray === undefined) {
            return '';
        }

        return DataDelimiter.toDelimitedString(this.metadataPatcher.joinUnsplittableMetadata(valueArray));
    }
}

exports.TrackFieldCreator = TrackFieldCreator;
