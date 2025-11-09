/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@angular/core';
import { FileAccessBase } from '../common/io/file-access.base';
import { DesktopBase } from '../common/io/desktop.base';
import { PersistentDatabase } from './persistent-database';

@Injectable()
export class DatabaseFactory {
    public constructor(
        private fileAccess: FileAccessBase,
        private desktop: DesktopBase,
    ) {}

    public async createAsync(): Promise<PersistentDatabase> {
        const databaseFile: string = this.fileAccess.combinePath([this.desktop.getApplicationDataDirectory(), 'Dopamine.db']);
        return await PersistentDatabase.createAsync(databaseFile);
    }
}
