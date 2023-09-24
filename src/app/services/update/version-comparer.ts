import { Constants } from '../../common/application/constants';

export class VersionComparer {
    public static isNewerVersion(oldVersion: string, newVersion: string): boolean {
        const oldVersionParts: string[] = oldVersion.split('-');
        const newVersionParts: string[] = newVersion.split('-');

        const oldVersionNumberAsString: string = oldVersionParts[0];
        const newVersionNumberAsString: string = newVersionParts[0];

        const oldVersionHasTag: boolean = oldVersionParts.length > 1;
        const newVersionHasTag: boolean = newVersionParts.length > 1;

        let oldVersionTag: string;
        let newVersionTag: string;

        if (oldVersionHasTag) {
            oldVersionTag = oldVersionParts[1];
        }

        if (newVersionHasTag) {
            newVersionTag = newVersionParts[1];
        }

        if (!oldVersionHasTag && !newVersionHasTag) {
            return this.isNewerVersionNumber(oldVersionNumberAsString, newVersionNumberAsString);
        }

        if (oldVersionHasTag && newVersionHasTag) {
            if (oldVersionNumberAsString === newVersionNumberAsString) {
                return this.isNewerVersionTag(oldVersionTag, newVersionTag);
            }

            return (
                this.isNewerVersionNumber(oldVersionNumberAsString, newVersionNumberAsString) &&
                this.isNewerVersionTag(oldVersionTag, newVersionTag)
            );
        }

        if (!oldVersionHasTag && newVersionHasTag) {
            return this.isNewerVersionNumber(oldVersionNumberAsString, newVersionNumberAsString);
        }

        if (oldVersionHasTag && !newVersionHasTag) {
            return this.isNewerVersionNumber(oldVersionNumberAsString, newVersionNumberAsString);
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
        if (oldVersionTag.includes(Constants.releaseCandidateApplicationTag) && newVersionTag.includes(Constants.previewApplicationTag)) {
            return false;
        }

        if (oldVersionTag.includes(Constants.previewApplicationTag) && newVersionTag.includes(Constants.releaseCandidateApplicationTag)) {
            return true;
        }

        if (
            (oldVersionTag.includes(Constants.previewApplicationTag) && newVersionTag.includes(Constants.previewApplicationTag)) ||
            (oldVersionTag.includes(Constants.releaseCandidateApplicationTag) &&
                newVersionTag.includes(Constants.releaseCandidateApplicationTag))
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
