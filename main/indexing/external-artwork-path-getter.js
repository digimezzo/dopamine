const { StringUtils } = require('../common/utils/string-utils');
const { Constants } = require('../common/application/constants');

class ExternalArtworkPathGetter {
    constructor(fileAccess) {
        this.fileAccess = fileAccess;
    }

    async getExternalArtworkPathAsync(audioFilePath) {
        if (StringUtils.isNullOrWhiteSpace(audioFilePath)) {
            return '';
        }

        const directory = this.fileAccess.getDirectoryPath(audioFilePath);
        const filesInDirectory = await this.fileAccess.getFilesInDirectoryAsync(directory);

        for (const filePath of filesInDirectory) {
            const fileName = this.fileAccess.getFileName(filePath);

            if (Constants.externalCoverArtPatterns.includes(fileName.toLowerCase())) {
                return filePath;
            }

            const fileNameWithoutExtension = this.fileAccess.getFileNameWithoutExtension(filePath);

            for (const externalCoverArtPattern of Constants.externalCoverArtPatterns) {
                const externalCoverArtPatternReplacedByFileName = StringUtils.replaceAll(
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

exports.ExternalArtworkPathGetter = ExternalArtworkPathGetter;
