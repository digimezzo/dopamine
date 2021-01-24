import { Injectable } from '@angular/core';
import { remote } from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';
import { ApplicationPaths } from '../base/application-paths';
import { DateTime } from '../date-time';

@Injectable()
export class FileSystem {
    public applicationDataDirectory(): string {
        return remote.app.getPath('userData');
    }

    public coverArtCacheFullPath(): string {
        return path.join(this.applicationDataDirectory(), ApplicationPaths.cacheFolder, ApplicationPaths.CoverArtCacheFolder);
    }

    public async getFilesInDirectoryAsync(directoryPath: string): Promise<string[]> {
        const fileNames: string[] = await fs.readdir(directoryPath);

        return fileNames
            .filter((fileName) => fs.lstatSync(path.join(directoryPath, fileName)).isFile())
            .map((fileName) => path.join(directoryPath, fileName));
    }

    public async getDirectoriesInDirectoryAsync(directoryPath: string): Promise<string[]> {
        const directoryNames: string[] = await fs.readdir(directoryPath);

        return directoryNames
            .filter((directoryName) => fs.lstatSync(path.join(directoryPath, directoryName)).isDirectory())
            .map((directoryName) => path.join(directoryPath, directoryName));
    }

    public async readFileContentsAsync(filePath: string): Promise<string> {
        return await fs.readFile(filePath, 'utf-8');
    }

    public getFileExtension(fileNameOrPath: string): string {
        return path.extname(fileNameOrPath);
    }

    public getFileName(fileNameOrPath: string): string {
        return path.parse(fileNameOrPath).name;
    }

    public getFileNameWithoutExtension(fileNameOrPath: string): string {
        const extension: string = path.extname(fileNameOrPath);
        return path.basename(fileNameOrPath, extension);
    }

    public async getDateModifiedInTicksAsync(fileOrDirectory: string): Promise<number> {
        const stat = await fs.stat(fileOrDirectory);
        const dateModified: Date = stat.mtime;

        return DateTime.convertDateToTicks(dateModified);
    }

    public async getDateCreatedInTicksAsync(fileOrDirectory: string): Promise<number> {
        const stat = await fs.stat(fileOrDirectory);
        const dateCreated: Date = stat.birthtime;

        return DateTime.convertDateToTicks(dateCreated);
    }

    public pathExists(pathToCheck: string): boolean {
        return fs.existsSync(pathToCheck);
    }

    public async getFilesizeInBytesAsync(filePath: string): Promise<number> {
        const stats = await fs.stat(filePath);
        const fileSizeInBytes = stats.size;

        return fileSizeInBytes;
    }

    public createFullDirectoryPathIfDoesNotExist(directoryPath: string): void {
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }
    }

    public getDirectoryPath(directoryOrFilePath: string): string {
        return path.dirname(directoryOrFilePath);
    }

    public async deleteFileIfExistsAsync(filePath: string): Promise<void> {
        if (fs.existsSync(filePath)) {
            await fs.unlink(filePath);
        }
    }

    public getDirectoryName(directoryPath: string): string {
        return path.basename(directoryPath);
    }
}
