const fs = require('fs-extra');
const path = require('path');
const { DateTime } = require('./date-time');

class FileAccess {
    static getFileName(fileNameOrPath) {
        return path.basename(fileNameOrPath);
    }

    static getFileSizeInBytes(filePath) {
        const stats = fs.statSync(filePath);
        return stats.size;
    }

    static getDateModifiedInTicks(fileOrDirectory) {
        const stat = fs.statSync(fileOrDirectory);
        const dateModified = stat.mtime;

        return DateTime.convertDateToTicks(dateModified);
    }

    static getDateCreatedInTicks(fileOrDirectory) {
        const stat = fs.statSync(fileOrDirectory);
        const dateCreated = stat.birthtime;

        return DateTime.convertDateToTicks(dateCreated);
    }

    static getFileExtension(fileNameOrPath) {
        return path.extname(fileNameOrPath);
    }
}

exports.FileAccess = FileAccess;
