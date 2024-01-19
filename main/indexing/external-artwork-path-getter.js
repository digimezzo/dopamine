const { StringUtils } = require('../common/utils/string-utils');
const { FileAccess } = require('../common/io/file-access');
const { Constants } = require('../common/application/constants');

class ExternalArtworkPathGetter {
    static async getExternalArtworkPathAsync(audioFilePath) {
        if (StringUtils.isNullOrWhiteSpace(audioFilePath)) {
            return '';
        }

        const directory = FileAccess.getDirectoryPath(audioFilePath);
        const filesInDirectory = await FileAccess.getFilesInDirectoryAsync(directory);

        for (const filePath of filesInDirectory) {
            const fileName = FileAccess.getFileName(filePath);

            if (Constants.externalCoverArtPatterns.includes(fileName.toLowerCase())) {
                return filePath;
            }

            const fileNameWithoutExtension = FileAccess.getFileNameWithoutExtension(filePath);

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
