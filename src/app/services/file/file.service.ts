import { Injectable } from '@angular/core';
import { Logger } from '../../common/logger';
import { BaseFileService } from './base-file.service';

@Injectable()
export class FileService implements BaseFileService {
    constructor(private logger: Logger) {}

    // public processParameters(): void {
    // if (remote.app.isPackaged) {
    //     // Workaround for missing executable argument
    //     process.argv.unshift(undefined);
    // }
    // // Parameters is now an array containing any files/folders that the OS will pass to the application
    // const parameters = remote.process.argv.slice(2);
    // if (parameters != undefined && parameters.length > 0) {
    //     this.logger.info(`Found parameters: ${parameters.join(', ')}`, 'AppComponent', 'ngOnInit');
    // }
    // }
}
