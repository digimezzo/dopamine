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
        const fileNamesWithoutDirectory: string[] = await fs.readdir(directoryPath);

        return fileNamesWithoutDirectory.map(fileNameWithoutDirectory => path.join(directoryPath, fileNameWithoutDirectory));
    }

    public async readFileContentsAsync(filePath: string): Promise<string> {
        return await fs.readFile(filePath, 'utf-8');
    }
}
