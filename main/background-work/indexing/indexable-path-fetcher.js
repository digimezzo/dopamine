const { IndexablePath } = require('./indexable-path');
const { FileFormats } = require('../common/application/file-formats');

class IndexablePathFetcher {
    constructor(folderRepository, directoryWalker, fileAccess, logger) {
        this.folderRepository = folderRepository;
        this.directoryWalker = directoryWalker;
        this.fileAccess = fileAccess;
        this.logger = logger;
    }

    async getIndexablePathsForAllFoldersAsync() {
        const indexablePaths = [];
        let folders = [];

        try {
            folders = this.folderRepository.getFolders() ?? [];
        } catch (e) {
            this.logger.error(e, 'An error occurred while getting folders', 'IndexablePathFetcher', 'getIndexablePathsForAllFoldersAsync');
        }

        for (const folder of folders) {
            if (this.fileAccess.pathExists(folder.path)) {
                try {
                    const indexablePathsForFolder = await this.getIndexablePathsForSingleFolderAsync(
                        folder,
                        FileFormats.supportedAudioExtensions,
                    );

                    indexablePaths.push(...indexablePathsForFolder);
                } catch (e) {
                    this.logger.error(
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

    async getIndexablePathsForSingleFolderAsync(folder, validFileExtensions) {
        const indexablePaths = [];

        try {
            const directoryWalkResult = await this.directoryWalker.getFilesInDirectoryAsync(folder.path);

            for (const e of directoryWalkResult.errors) {
                this.logger.error(
                    e,
                    `Error occurred while getting files recursively for folder '${folder.path}'`,
                    'IndexablePathFetcher',
                    'getIndexablePathsForSingleFolderAsync',
                );
            }

            for (const filePath of directoryWalkResult.filePaths) {
                try {
                    const fileExtension = this.fileAccess.getFileExtension(filePath);

                    if (validFileExtensions.includes(fileExtension.toLowerCase())) {
                        const dateModifiedInTicks = this.fileAccess.getDateModifiedInTicks(filePath);
                        indexablePaths.push(new IndexablePath(filePath, dateModifiedInTicks, folder.folderId));
                    }
                } catch (e) {
                    this.logger.error(
                        e,
                        `Error occurred while getting indexable path for file '${filePath}'`,
                        'IndexablePathFetcher',
                        'getIndexablePathsForSingleFolderAsync',
                    );
                }
            }
        } catch (e) {
            this.logger.error(
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
