import { Constants } from '../application/constants';

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

    public static getSortableString(originalString: string | undefined, removePrefixes: boolean): string {
        if (this.isNullOrWhiteSpace(originalString)) {
            return '';
        }

        try {
            const trimmedAndLowerCasedOriginalString: string = originalString!.trim().toLowerCase();

            if (!removePrefixes) {
                return trimmedAndLowerCasedOriginalString;
            }

            for (const removablePrefix of Constants.removablePrefixes) {
                const prefixFollowedBySpace: string = `${removablePrefix} `;

                if (trimmedAndLowerCasedOriginalString.startsWith(prefixFollowedBySpace)) {
                    return trimmedAndLowerCasedOriginalString.replace(prefixFollowedBySpace, '').trim();
                }
            }
        } catch (e: unknown) {
            // Ignore this error
        }

        return originalString!.toLowerCase();
    }
}
