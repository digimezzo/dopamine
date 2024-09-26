const { DataDelimiter } = require('./data-delimiter');

class TrackFieldCreator {
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

        return DataDelimiter.toDelimitedString(valueArray);
    }
}

exports.TrackFieldCreator = TrackFieldCreator;
