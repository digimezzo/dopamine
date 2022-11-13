import { Injectable } from '@angular/core';
import { Constants } from '../../common/application/constants';
import { BaseFileSystem } from '../../common/io/base-file-system';
import { Strings } from '../../common/strings';

@Injectable()
export class ExternalArtworkPathGetter {
    constructor(private fileSystem: BaseFileSystem) {}

    public async getExternalArtworkPathAsync(audioFilePath: string): Promise<string> {
        if (Strings.isNullOrWhiteSpace(audioFilePath)) {
            return undefined;
        }

        const directory: string = this.fileSystem.getDirectoryPath(audioFilePath);
        const filesInDirectory: string[] = await this.fileSystem.getFilesInDirectoryAsync(directory);

        for (const filePath of filesInDirectory) {
            const fileName: string = this.fileSystem.getFileName(filePath);

            if (Constants.externalCoverArtPatterns.includes(fileName.toLowerCase())) {
                return filePath;
            }

            const fileNameWithoutExtension: string = this.fileSystem.getFileNameWithoutExtension(filePath);

            for (const externalCoverArtPattern of Constants.externalCoverArtPatterns) {
                const externalCoverArtPatternReplacedByFileName: string = Strings.replaceAll(
                    externalCoverArtPattern,
                    '%filename%',
                    fileNameWithoutExtension
                );

                if (fileName.toLowerCase() === externalCoverArtPatternReplacedByFileName.toLowerCase()) {
                    return filePath;
                }
            }
        }

        return undefined;
    }
}
