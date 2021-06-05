export class Strings {
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

        if (stringToCheck.trim() === '') {
            return true;
        }

        return false;
    }

    public static replaceAll(sourceString: string, oldValue: string, newValue: string): string {
        return sourceString.split(oldValue).join(newValue);
    }
}
