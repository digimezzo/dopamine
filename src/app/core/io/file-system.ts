import { Injectable } from '@angular/core';
import { remote } from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class FileSystem {
    constructor() {
    }

    public applicationDataDirectory(): string {
        return remote.app.getPath('userData');
    }

    public async getFilesInDirectoryAsync(directoryPath: string): Promise<string[]> {
        const fileNames: string[] = await fs.readdir(directoryPath);

        return fileNames
            .filter(fileName => (fs.lstatSync(path.join(directoryPath, fileName)).isFile()))
            .map(fileName => path.join(directoryPath, fileName));
    }

    public async getDirectoriesInDirectoryAsync(directoryPath: string): Promise<string[]> {
        const directoryNames: string[] = await fs.readdir(directoryPath);

        return directoryNames
            .filter(directoryName => (fs.lstatSync(path.join(directoryPath, directoryName)).isDirectory()))
            .map(directoryName => path.join(directoryPath, directoryName));
    }

    public async readFileContentsAsync(filePath: string): Promise<string> {
        return await fs.readFile(filePath, 'utf-8');
    }

    public getFileExtension(fileNameOrPath: string): string {
        return path.extname(fileNameOrPath);
    }

    public async getDateModifiedAsync(fileOrDirectory: string): Promise<Date> {
        const stat = await fs.stat(fileOrDirectory);

        return stat.mtime;
    }

    public pathExists(pathToCheck: string): boolean {
        return fs.existsSync(pathToCheck);
    }
}
