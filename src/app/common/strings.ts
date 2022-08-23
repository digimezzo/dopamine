import { Constants } from './application/constants';

export class Strings {
    public static get empty(): string {
        return '';
    }

    public static equalsIgnoreCase(string1: string, string2: string): boolean {
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

    public static isNullOrWhiteSpace(stringToCheck: string): boolean {
        if (stringToCheck == undefined) {
            return true;
        }

        try {
            if (stringToCheck.trim() === '') {
                return true;
            }
        } catch (e) {
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

    public static getSortableString(originalString: string, removePrefixes: boolean): string {
        if (this.isNullOrWhiteSpace(originalString)) {
            return '';
        }

        try {
            const trimmedAndLowerCasedOriginalString: string = originalString.trim().toLowerCase();

            if (!removePrefixes) {
                return trimmedAndLowerCasedOriginalString;
            }

            for (const removablePrefix of Constants.removablePrefixes) {
                const prefixFollowedBySpace: string = `${removablePrefix} `;

                if (trimmedAndLowerCasedOriginalString.startsWith(prefixFollowedBySpace)) {
                    return trimmedAndLowerCasedOriginalString.replace(prefixFollowedBySpace, '').trim();
                }
            }
        } catch (e) {
            // Ignore this error
        }

        return originalString.toLowerCase();
    }
}
