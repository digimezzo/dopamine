export class VersionComparer {
    public static isNewerVersion(oldVersion: string, newVersion: string): boolean {
        const oldVersionParts: string[] = oldVersion.split('-');
        const newVersionParts: string[] = newVersion.split('-');

        if (oldVersionParts.length === 1 && newVersionParts.length === 1) {
            return this.isNewerVersionNumber(oldVersionParts[0], newVersionParts[0]);
        }

        if (oldVersionParts.length === 2 && newVersionParts.length === 2) {
            if (oldVersionParts[0] === newVersionParts[0]) {
                return this.isNewerVersionTag(oldVersionParts[1], newVersionParts[1]);
            }

            return (
                this.isNewerVersionNumber(oldVersionParts[0], newVersionParts[0]) &&
                this.isNewerVersionTag(oldVersionParts[1], newVersionParts[1])
            );
        }

        if (oldVersionParts.length === 1 && newVersionParts.length === 2) {
            return this.isNewerVersionNumber(oldVersionParts[0], newVersionParts[0]);
        }

        return false;
    }

    private static isNewerVersionNumber(oldVersionNumberAsString: string, newVersionNumberAsString: string): boolean {
        const oldVersionParts = oldVersionNumberAsString.split('.');
        const newVersionParts = newVersionNumberAsString.split('.');

        for (let i = 0; i < newVersionParts.length; i++) {
            let newVersionNumber: number = parseInt(newVersionParts[i], 10);
            let oldVersionNumber: number = parseInt(oldVersionParts[i], 10);
            if (newVersionNumber == undefined || Number.isNaN(newVersionNumber)) {
                newVersionNumber = 0;
            }
            if (oldVersionNumber == undefined || Number.isNaN(oldVersionNumber)) {
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

    private static isNewerVersionTag(oldVersionTag: string, newVersionTag: string): boolean {
        if (oldVersionTag.includes('rc') && newVersionTag.includes('next')) {
            return false;
        }

        if (oldVersionTag.includes('next') && newVersionTag.includes('rc')) {
            return true;
        }

        if (
            (oldVersionTag.includes('next') && newVersionTag.includes('next')) ||
            (oldVersionTag.includes('rc') && newVersionTag.includes('rc'))
        ) {
            const oldVersionTagParts: string[] = oldVersionTag.split('.');
            const newVersionTagParts: string[] = newVersionTag.split('.');

            const oldVersionIteration: number = parseInt(oldVersionTagParts[1], 10);
            const newVersionIteration: number = parseInt(newVersionTagParts[1], 10);

            return newVersionIteration > oldVersionIteration;
        }

        return false;
    }
}
