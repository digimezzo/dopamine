import { Injectable } from '@angular/core';
import * as events from 'events';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import * as readline from 'readline';
import { DateTime } from '../date-time';
import { FileAccessBase } from './file-access.base';

@Injectable()
export class FileAccess implements FileAccessBase {
    private readonly _pathSeparator: string = '';

    public constructor(private dateTime: DateTime) {
        this._pathSeparator = path.sep;
    }

    public combinePath(pathPieces: string[]): string {
        if (pathPieces == undefined || pathPieces.length === 0) {
            return '';
        }

        if (pathPieces.length === 1) {
            return pathPieces[0];
        }

        return pathPieces.join(this._pathSeparator);
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
            } catch (e: unknown) {
                if (continueOnError == undefined || !continueOnError) {
                    throw e;
                }

                if (errors != undefined) {
                    if (e instanceof Error) {
                        errors.push(e);
                    }
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
            } catch (e: unknown) {
                if (continueOnError == undefined || !continueOnError) {
                    throw e;
                }

                if (errors != undefined) {
                    if (e instanceof Error) {
                        errors.push(e);
                    }
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
            } catch (e: unknown) {
                if (continueOnError == undefined || !continueOnError) {
                    throw e;
                }

                if (errors != undefined) {
                    if (e instanceof Error) {
                        errors.push(e);
                    }
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
        return this.combinePath([parentDirectoryPath, `${fileNameWithoutExtension}`]);
    }

    public getDateModifiedInTicks(fileOrDirectory: string): number {
        const stat = fs.statSync(fileOrDirectory);
        const dateModified: Date = stat.mtime;

        return this.dateTime.convertDateToTicks(dateModified);
    }

    public getDateCreatedInTicks(fileOrDirectory: string): number {
        const stat = fs.statSync(fileOrDirectory);
        const dateCreated: Date = stat.birthtime;

        return this.dateTime.convertDateToTicks(dateCreated);
    }

    public pathExists(pathToCheck: string): boolean {
        return fs.existsSync(pathToCheck);
    }

    public getFileSizeInBytes(filePath: string): number {
        const stats = fs.statSync(filePath);
        return stats.size;
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
        return this.combinePath([parentDirectoryPath, `${newFileName}${fileExtension}`]);
    }

    public changeFolderName(folderPath: string, newFolderName: string): string {
        const parentDirectoryPath: string = this.getDirectoryPath(folderPath);
        return this.combinePath([parentDirectoryPath, newFolderName]);
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
