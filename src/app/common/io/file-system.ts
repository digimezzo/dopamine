import { Injectable } from '@angular/core';
import { remote } from 'electron';
import * as events from 'events';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as readline from 'readline';
import { ApplicationPaths } from '../application/application-paths';
import { DateTime } from '../date-time';

@Injectable()
export class FileSystem {
    private _applicationDataDirectory: string = '';
    private _musicDirectory: string = '';
    private _pathSeparator: string = '';

    constructor() {
        this._applicationDataDirectory = remote.app.getPath('userData');
        this._musicDirectory = remote.app.getPath('music');
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

    public async getFilesInDirectoryAsync(directoryPath: string): Promise<string[]> {
        const fileNames: string[] = await fs.readdir(directoryPath);

        return fileNames
            .filter((fileName) => fs.lstatSync(this.combinePath([directoryPath, fileName])).isFile())
            .map((fileName) => this.combinePath([directoryPath, fileName]));
    }

    public getFilesInDirectory(directoryPath: string): string[] {
        const fileNames: string[] = fs.readdirSync(directoryPath);

        return fileNames
            .filter((fileName) => fs.lstatSync(this.combinePath([directoryPath, fileName])).isFile())
            .map((fileName) => this.combinePath([directoryPath, fileName]));
    }

    public async getDirectoriesInDirectoryAsync(directoryPath: string): Promise<string[]> {
        const directoryNames: string[] = await fs.readdir(directoryPath);

        return directoryNames
            .filter((directoryName) => fs.lstatSync(this.combinePath([directoryPath, directoryName])).isDirectory())
            .map((directoryName) => this.combinePath([directoryPath, directoryName]));
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

    public changeFileExtension(filePath: string, newFileExtension: string): string {
        const parentDirectoryPath: string = this.getDirectoryPath(filePath);
        const fileNameWithoutExtension: string = this.getFileNameWithoutExtension(filePath);
        const pathWithNewFileExtension: string = this.combinePath([parentDirectoryPath, `${fileNameWithoutExtension}${newFileExtension}`]);

        return pathWithNewFileExtension;
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
}
