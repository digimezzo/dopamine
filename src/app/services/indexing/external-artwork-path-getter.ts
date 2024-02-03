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

    for (const filePath of filesInDirectory) {
      const fileName: string = this.fileAccess.getFileName(filePath);

      if (Constants.externalCoverArtPatterns.includes(fileName.toLowerCase())) {
        return filePath;
      }

      const fileNameWithoutExtension: string = this.fileAccess.getFileNameWithoutExtension(filePath);

      for (const externalCoverArtPattern of Constants.externalCoverArtPatterns) {
        const externalCoverArtPatternReplacedByFileName: string = StringUtils.replaceAll(
          externalCoverArtPattern,
          '%filename%',
          fileNameWithoutExtension,
        );

        if (fileName.toLowerCase() === externalCoverArtPatternReplacedByFileName.toLowerCase()) {
          return filePath;
        }
      }
    }

    return '';
  }
}
