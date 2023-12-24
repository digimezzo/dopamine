class DataDelimiter {
    static delimiter = ';';

    static toDelimitedString(stringArray) {
        if (stringArray === undefined) {
            return '';
        }

        if (stringArray.length === 0) {
            return '';
        }

        return stringArray
            .filter((x) => x !== '')
            .map((x) => this.addDelimiters(x.trim()))
            .join('');
    }

    static fromDelimitedString(delimitedString) {
        if (delimitedString === undefined || delimitedString.length === 0) {
            return [];
        }

        const delimitedStrings = delimitedString.split(DataDelimiter.delimiter);

        return delimitedStrings.filter((x) => x !== '').map((x) => this.removeDelimiters(x));
    }

    static addDelimiters(originalString) {
        return `${this.delimiter}${originalString}${this.delimiter}`;
    }

    static removeDelimiters(delimitedString) {
        return delimitedString.split(this.delimiter).join('');
    }
}

exports.DataDelimiter = DataDelimiter;
