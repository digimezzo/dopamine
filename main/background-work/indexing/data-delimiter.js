class DataDelimiter {
    static delimiter = ';';

    static toDelimitedString(stringArray) {
        if (!Array.isArray(stringArray) || stringArray.length === 0) {
            return '';
        }

        const result = [];

        for (const item of stringArray) {
            const parts = item
                .split(';') // Split by semicolon
                .map((x) => x.trim()) // Trim whitespace
                .filter((x) => x !== ''); // Remove empty strings

            for (const part of parts) {
                result.push(this.addDelimiters(part));
            }
        }

        return result.join('');
    }

    static addDelimiters(originalString) {
        return `${this.delimiter}${originalString}${this.delimiter}`;
    }
}

exports.DataDelimiter = DataDelimiter;
