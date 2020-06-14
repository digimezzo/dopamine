export class VersionComparer {
    public static isNewerVersion(oldVersion: string, newVersion: string): boolean {
        const oldParts = oldVersion.split('.');
        const newParts = newVersion.split('.');

        for (let i = 0; i < newParts.length; i++) {
            const a = parseInt(newParts[i], 10) || 0;
            const b = parseInt(oldParts[i], 10) || 0;

            if (a > b) {
                return true;
            }

            if (a < b) {
                return false;
            }
        }

        return false;
    }
}
