import { Injectable } from '@angular/core';
import * as events from 'events';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import * as readline from 'readline';
import { ApplicationPaths } from '../application/application-paths';
import { DateTime } from '../date-time';
import { BaseDesktop } from './base-desktop';
import { BaseFileAccess } from './base-file-access';

@Injectable()
export class FileAccess implements BaseFileAccess {
    private _applicationDataDirectory: string = '';
    private _musicDirectory: string = '';
    private _pathSeparator: string = '';

    constructor(private desktop: BaseDesktop, private dateTime: DateTime) {
        this._applicationDataDirectory = this.desktop.getApplicationDataDirectory();
        this._musicDirectory = this.desktop.getMusicDirectory();
        this._pathSeparator = path.sep;
    }

    public combinePath(pathPieces: string[]): string {
        if (pathPieces == undefined || pathPieces.length === 0) {
            return '';
        }

        if (pathPieces.length === 1) {
            return pathPieces[0];
        }

        const combinedPath: string = pathPieces.join(this._pathSeparator);

        return combinedPath;
    }

    public applicationDataDirectory(): string {
        return this._applicationDataDirectory;
    }

    public musicDirectory(): string {
        return this._musicDirectory;
    }

    public coverArtCacheFullPath(): string {
        return this.combinePath([this._applicationDataDirectory, ApplicationPaths.cacheFolder, ApplicationPaths.coverArtCacheFolder]);
    }

    public coverArtFullPath(artworkId: string): string {
        return this.combinePath([this.coverArtCacheFullPath(), `${artworkId}.jpg`]);
    }

    public async getFilesInDirectoryAsync(directoryPath: string, continueOnError?: boolean, errors?: Error[]): Promise<string[]> {
        const possibleFileNames: string[] = await fs.readdir(directoryPath);
        const confirmedFilePaths: string[] = [];

        for (const possibleFileName of possibleFileNames) {
            const possibleFilePath: string = this.combinePath([directoryPath, possibleFileName]);

            try {
                if (fs.lstatSync(possibleFilePath).isFile()) {
                    confirmedFilePaths.push(possibleFilePath);
                }
            } catch (e) {
                if (continueOnError == undefined || !continueOnError) {
                    throw e;
                }

                if (errors != undefined) {
                    errors.push(e);
                }
            }
        }

        return confirmedFilePaths;
    }

    public getFilesInDirectory(directoryPath: string, continueOnError?: boolean, errors?: Error[]): string[] {
        const possibleFileNames: string[] = fs.readdirSync(directoryPath);
        const confirmedFilePaths: string[] = [];

        for (const possibleFileName of possibleFileNames) {
            const possibleFilePath: string = this.combinePath([directoryPath, possibleFileName]);

            try {
                if (fs.lstatSync(possibleFilePath).isFile()) {
                    confirmedFilePaths.push(possibleFilePath);
                }
            } catch (e) {
                if (continueOnError == undefined || !continueOnError) {
                    throw e;
                }

                if (errors != undefined) {
                    errors.push(e);
                }
            }
        }

        return confirmedFilePaths;
    }

    public async getDirectoriesInDirectoryAsync(directoryPath: string, continueOnError?: boolean, errors?: Error[]): Promise<string[]> {
        const possibleDirectoryNames: string[] = await fs.readdir(directoryPath);
        const confirmedDirectoryPaths: string[] = [];

        for (const possibleDirectoryName of possibleDirectoryNames) {
            const possibleDirectoryPath: string = this.combinePath([directoryPath, possibleDirectoryName]);

            try {
                if (fs.lstatSync(possibleDirectoryPath).isDirectory()) {
                    confirmedDirectoryPaths.push(possibleDirectoryPath);
                }
            } catch (e) {
                if (continueOnError == undefined || !continueOnError) {
                    throw e;
                }

                if (errors != undefined) {
                    errors.push(e);
                }
            }
        }

        return confirmedDirectoryPaths;
    }

    public getFileExtension(fileNameOrPath: string): string {
        return path.extname(fileNameOrPath);
    }

    public getFileName(fileNameOrPath: string): string {
        return path.basename(fileNameOrPath);
    }

    public getFileNameWithoutExtension(fileNameOrPath: string): string {
        const extension: string = path.extname(fileNameOrPath);
        return path.basename(fileNameOrPath, extension);
    }

    public getPathWithoutExtension(filePath: string): string {
        const parentDirectoryPath: string = this.getDirectoryPath(filePath);
        const fileNameWithoutExtension: string = this.getFileNameWithoutExtension(filePath);
        const pathWithNewFileExtension: string = this.combinePath([parentDirectoryPath, `${fileNameWithoutExtension}`]);

        return pathWithNewFileExtension;
    }

    public async getDateModifiedInTicksAsync(fileOrDirectory: string): Promise<number> {
        const stat = await fs.stat(fileOrDirectory);
        const dateModified: Date = stat.mtime;

        return this.dateTime.convertDateToTicks(dateModified);
    }

    public async getDateCreatedInTicksAsync(fileOrDirectory: string): Promise<number> {
        const stat = await fs.stat(fileOrDirectory);
        const dateCreated: Date = stat.birthtime;

        return this.dateTime.convertDateToTicks(dateCreated);
    }

    public pathExists(pathToCheck: string): boolean {
        return fs.existsSync(pathToCheck);
    }

    public async getFileSizeInBytesAsync(filePath: string): Promise<number> {
        const stats = await fs.stat(filePath);
        const fileSizeInBytes = stats.size;

        return fileSizeInBytes;
    }

    public createFullDirectoryPathIfDoesNotExist(directoryPath: string): void {
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }
    }

    public createFile(filePath: string): void {
        fs.createFileSync(filePath);
    }

    public getDirectoryPath(directoryOrFilePath: string): string {
        return path.dirname(directoryOrFilePath);
    }

    public async deleteFileIfExistsAsync(filePath: string): Promise<void> {
        if (fs.existsSync(filePath)) {
            await fs.unlink(filePath);
        }
    }

    public deleteDirectoryRecursively(directoryPath: string): void {
        fs.rmdirSync(directoryPath, { recursive: true });
    }

    public renameFileOrDirectory(oldPath: string, newPath: string): void {
        fs.renameSync(oldPath, newPath);
    }

    public getDirectoryOrFileName(directoryOrFilePath: string): string {
        return path.basename(directoryOrFilePath);
    }

    public getFileContentAsString(filePath: string): string {
        return fs.readFileSync(filePath, 'utf-8');
    }

    public async getFileContentAsBufferAsync(filePath: string): Promise<Buffer> {
        return await fs.readFile(filePath);
    }

    public writeToFile(filePath: string, textToWrite: string): void {
        fs.writeFileSync(filePath, textToWrite);
    }

    public copyFile(oldPath: string, newPath: string): void {
        return fs.copyFileSync(oldPath, newPath);
    }

    public changeFileName(filePath: string, newFileName: string): string {
        const parentDirectoryPath: string = this.getDirectoryPath(filePath);
        const fileExtension: string = this.getFileExtension(filePath);
        const pathWithNewFileName: string = this.combinePath([parentDirectoryPath, `${newFileName}${fileExtension}`]);

        return pathWithNewFileName;
    }

    public changeFolderName(folderPath: string, newFolderName: string): string {
        const parentDirectoryPath: string = this.getDirectoryPath(folderPath);
        const pathWithNewFolderName: string = this.combinePath([parentDirectoryPath, newFolderName]);

        return pathWithNewFolderName;
    }

    public isAbsolutePath(directoryOrFilePath: string): boolean {
        return path.isAbsolute(directoryOrFilePath);
    }

    public generateFullPath(baseDirectoryPath: string, directoryOrFilePath: string): string {
        return path.resolve(baseDirectoryPath, directoryOrFilePath);
    }

    public async readLinesAsync(filePath: string): Promise<string[]> {
        const lines: string[] = [];

        const readlineInterface: readline.Interface = readline.createInterface({
            input: fs.createReadStream(filePath),
            output: process.stdout,
            terminal: false,
        });

        readlineInterface.on('line', (line) => {
            lines.push(line);
        });

        await events.once(readlineInterface, 'close');

        return lines;
    }

    public async appendTextToFileAsync(filePath: string, text: string): Promise<void> {
        await fs.outputFile(filePath, `${text}${os.EOL}`, { flag: 'a' });
    }

    public async replaceTextInFileAsync(filePath: string, text: string): Promise<void> {
        await fs.outputFile(filePath, `${text}${os.EOL}`);
    }

    public async clearFileContentsAsync(filePath: string): Promise<void> {
        await fs.truncate(filePath);
    }
}
