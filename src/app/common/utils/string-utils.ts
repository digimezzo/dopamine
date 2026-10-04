export class StringUtils {
    public static get empty(): string {
        return '';
    }

    public static equalsIgnoreCase(string1: string | undefined, string2: string | undefined): boolean {
        if (string1 == undefined && string2 == undefined) {
            return true;
        }

        if (string1 == undefined) {
            return false;
        }

        if (string2 == undefined) {
            return false;
        }

        return string1.toLowerCase() === string2.toLowerCase();
    }

    public static includesIgnoreCase(sourceString: string | undefined, stringToCheck: string | undefined): boolean {
        if (sourceString == undefined && stringToCheck == undefined) {
            return false;
        }

        if (sourceString == undefined) {
            return false;
        }

        if (stringToCheck == undefined) {
            return false;
        }

        return sourceString.toLowerCase().includes(stringToCheck.toLowerCase());
    }

    public static isNullOrWhiteSpace(stringToCheck: string | undefined): boolean {
        if (stringToCheck == undefined) {
            return true;
        }

        try {
            if (stringToCheck.trim() === '') {
                return true;
            }
        } catch (e: unknown) {
            return true;
        }

        return false;
    }

    public static replaceFirst(sourceString: string, oldValue: string, newValue: string): string {
        return sourceString.replace(oldValue, newValue);
    }

    public static replaceAll(sourceString: string, oldValue: string, newValue: string): string {
        return sourceString.split(oldValue).join(newValue);
    }

    public static removeAccents(stringWithAccents: string): string {
        return stringWithAccents.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    public static capitalizeFirstLetter(str: string): string {
        if (this.isNullOrWhiteSpace(str)) {
            return str;
        }

        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    public static getSortableString(originalString: string | undefined, ignoredPrefixes: string[] = []): string {
        if (ignoredPrefixes.length === 0) {
            return this.getSortableStringWithPreparedPrefixes(originalString, ignoredPrefixes);
        }

        return this.createSortableStringGetter(ignoredPrefixes)(originalString);
    }

    public static createSortableStringGetter(ignoredPrefixes: string[]): (originalString: string | undefined) => string {
        const prefixes = ignoredPrefixes
            .map((value) => value.trim().toLowerCase())
            .filter((value) => value.length > 0)
            .sort((first, second) => second.length - first.length);

        return (originalString) => this.getSortableStringWithPreparedPrefixes(originalString, prefixes);
    }

    private static getSortableStringWithPreparedPrefixes(originalString: string | undefined, prefixes: string[]): string {
        if (this.isNullOrWhiteSpace(originalString)) {
            return '';
        }

        try {
            const name = originalString!.trim().toLowerCase();
            const prefix = prefixes.find(
                (value) =>
                    name.startsWith(value) &&
                    /^\s/.test(name.substring(value.length)) &&
                    name.substring(value.length).trim().length > 0,
            );

            return prefix ? name.substring(prefix.length).trimStart() : name;
        } catch (e: unknown) {
            // Ignore this error
        }

        return originalString!.toLowerCase();
    }
}
