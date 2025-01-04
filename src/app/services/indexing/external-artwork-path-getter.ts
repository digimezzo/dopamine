import { Injectable } from '@angular/core';
import { Constants } from '../../common/application/constants';
import { StringUtils } from '../../common/utils/string-utils';
import { FileAccessBase } from '../../common/io/file-access.base';

@Injectable()
export class ExternalArtworkPathGetter {
    public constructor(private fileAccess: FileAccessBase) {}

    public async getExternalArtworkPathAsync(audioFilePath: string | undefined): Promise<string> {
        if (StringUtils.isNullOrWhiteSpace(audioFilePath)) {
            return '';
        }

        const directory: string = this.fileAccess.getDirectoryPath(audioFilePath!);
        const filesInDirectory: string[] = await this.fileAccess.getFilesInDirectoryAsync(directory);
        const audioFilePathWithoutExtension: string = this.fileAccess.getFileNameWithoutExtension(audioFilePath!);
        const lowerCaseCoverArtPossibilities: string[] = Constants.externalCoverArtPatterns.map((externalCoverArtPattern) => {
            return StringUtils.replaceAll(externalCoverArtPattern, '%filename%', audioFilePathWithoutExtension).toLowerCase();
        });

        for (const filePath of filesInDirectory) {
            const fileName: string = this.fileAccess.getFileName(filePath);

            if (lowerCaseCoverArtPossibilities.includes(fileName.toLowerCase())) {
                return filePath;
            }
        }

        return '';
    }
}
