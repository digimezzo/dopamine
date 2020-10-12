export class VersionComparer {
    public static isNewerVersion(oldVersion: string, newVersion: string): boolean {
        const oldVarionParts = oldVersion.split('.');
        const newVersionParts = newVersion.split('.');

        for (let i = 0; i < newVersionParts.length; i++) {
            let newVersionNumber: number = parseInt(newVersionParts[i], 10);
            let oldVersionNumber: number = parseInt(oldVarionParts[i], 10);

            if (newVersionNumber === null || newVersionNumber === undefined || Number.isNaN(newVersionNumber)) {
                newVersionNumber = 0;
            }

            if (oldVersionNumber === null || oldVersionNumber === undefined || Number.isNaN(oldVersionNumber)) {
                oldVersionNumber = 0;
            }

            if (newVersionNumber > oldVersionNumber) {
                return true;
            }

            if (newVersionNumber < oldVersionNumber) {
                return false;
            }
        }

        return false;
    }
}
