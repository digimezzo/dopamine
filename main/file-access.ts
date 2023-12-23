import * as fs from 'fs-extra';
import * as path from 'path';
import { DateTime } from './date-time';

export class FileAccess {
    public static getFileName(fileNameOrPath: string): string {
        return path.basename(fileNameOrPath);
    }

    public static getFileSizeInBytes(filePath: string): number {
        const stats = fs.statSync(filePath);
        const fileSizeInBytes = stats.size;

        return fileSizeInBytes;
    }

    public static getDateModifiedInTicks(fileOrDirectory: string): number {
        const stat = fs.statSync(fileOrDirectory);
        const dateModified: Date = stat.mtime;

        return DateTime.convertDateToTicks(dateModified);
    }

    public static getDateCreatedInTicks(fileOrDirectory: string): number {
        const stat = fs.statSync(fileOrDirectory);
        const dateCreated: Date = stat.birthtime;

        return DateTime.convertDateToTicks(dateCreated);
    }

    public static getFileExtension(fileNameOrPath: string): string {
        return path.extname(fileNameOrPath);
    }
}
