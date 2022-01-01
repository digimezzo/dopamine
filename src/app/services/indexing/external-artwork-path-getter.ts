import { Injectable } from '@angular/core';
import { Constants } from '../../common/application/constants';
import { FileSystem } from '../../common/io/file-system';
import { Strings } from '../../common/strings';

@Injectable()
export class ExternalArtworkPathGetter {
    constructor(private fileSystem: FileSystem) {}

    public getExternalArtworkPath(audioFilePath: string): string {
        if (Strings.isNullOrWhiteSpace(audioFilePath)) {
            return undefined;
        }

        const directory: string = this.fileSystem.getDirectoryPath(audioFilePath);
        const fileNameWithoutExtension: string = this.fileSystem.getFileNameWithoutExtension(audioFilePath);

        for (const externalCoverArtPattern of Constants.externalCoverArtPatterns) {
            const possibleExternalArtworkFilePath: string = this.fileSystem.combinePath([
                directory,
                Strings.replaceAll(externalCoverArtPattern, '%filename%', fileNameWithoutExtension),
            ]);

            if (this.fileSystem.pathExists(possibleExternalArtworkFilePath)) {
                return possibleExternalArtworkFilePath;
            }
        }

        return undefined;
    }
}
