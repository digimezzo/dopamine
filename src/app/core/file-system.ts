import { Injectable } from '@angular/core';
import { remote } from 'electron';
import * as fs from 'fs-extra';

@Injectable()
export class FileSystem {
    constructor() {
    }

    public applicationDataDirectory(): string {
        return remote.app.getPath('userData');
    }

    public pathExists(pathToCheck: string): boolean {
        return fs.existsSync(pathToCheck);
    }
}
