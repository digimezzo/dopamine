const { IndexablePath } = require('./indexable-path');
const { FileFormats } = require('../common/application/file-formats');
const { FileAccess } = require('../common/io/file-access');
const { Logger } = require('../common/logger');
const { DirectoryWalker } = require('./directory-walker');
const { FolderRepository } = require('../data/folder-repository');

class IndexablePathFetcher {
    static async getIndexablePathsForAllFoldersAsync() {
        const indexablePaths = [];
        let folders = [];

        try {
            folders = FolderRepository.getFolders() ?? [];
        } catch (e) {
            Logger.error(e, 'An error occurred while getting folders', 'IndexablePathFetcher', 'getIndexablePathsForAllFoldersAsync');
        }

        for (const folder of folders) {
            if (FileAccess.pathExists(folder.path)) {
                try {
                    const indexablePathsForFolder = await this.getIndexablePathsForSingleFolderAsync(
                        folder,
                        FileFormats.supportedAudioExtensions,
                    );

                    indexablePaths.push(...indexablePathsForFolder);
                } catch (e) {
                    Logger.error(
                        e,
                        `Could not get indexable paths for folder '${folder.path}'`,
                        'IndexablePathFetcher',
                        'getIndexablePathsForAllFoldersAsync',
                    );
                }
            }
        }

        return indexablePaths;
    }

    static async getIndexablePathsForSingleFolderAsync(folder, validFileExtensions) {
        const indexablePaths = [];

        try {
            const directoryWalkResult = await DirectoryWalker.getFilesInDirectoryAsync(folder.path);

            for (const e of directoryWalkResult.errors) {
                Logger.error(
                    e,
                    `Error occurred while getting files recursively for folder '${folder.path}'`,
                    'IndexablePathFetcher',
                    'getIndexablePathsForSingleFolderAsync',
                );
            }

            for (const filePath of directoryWalkResult.filePaths) {
                try {
                    const fileExtension = FileAccess.getFileExtension(filePath);

                    if (validFileExtensions.includes(fileExtension.toLowerCase())) {
                        const dateModifiedInTicks = FileAccess.getDateModifiedInTicks(filePath);
                        indexablePaths.push(new IndexablePath(filePath, dateModifiedInTicks, folder.folderId));
                    }
                } catch (e) {
                    Logger.error(
                        e,
                        `Error occurred while getting indexable path for file '${filePath}'`,
                        'IndexablePathFetcher',
                        'getIndexablePathsForSingleFolderAsync',
                    );
                }
            }
        } catch (e) {
            Logger.error(
                e,
                `An error occurred while fetching indexable paths for folder '${folder.path}'`,
                'IndexablePathFetcher',
                'getIndexablePathsForSingleFolderAsync',
            );
        }

        return indexablePaths;
    }
}

exports.IndexablePathFetcher = IndexablePathFetcher;
