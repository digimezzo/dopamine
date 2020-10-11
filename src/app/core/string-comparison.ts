export class StringComparison {
    public static equalsIgnoreCase(string1: string, string2: string): boolean {
        if (string1 === null && string2 === null) {
            return true;
        }

        if (string1 === null && string2 === undefined) {
            return false;
        }

        if (string1 === undefined && string2 === null) {
            return false;
        }

        return string1.toLowerCase() === string2.toLowerCase();
    }
}
