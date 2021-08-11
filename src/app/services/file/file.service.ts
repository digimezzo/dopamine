import { Injectable } from '@angular/core';
import { FileFormats } from '../../common/application/file-formats';
import { BaseRemoteProxy } from '../../common/io/base-remote-proxy';
import { FileSystem } from '../../common/io/file-system';
import { Logger } from '../../common/logger';
import { BaseFileService } from './base-file.service';

@Injectable()
export class FileService implements BaseFileService {
    constructor(private fileSystem: FileSystem, private remoteProxy: BaseRemoteProxy, private logger: Logger) {}

    public hasPlayableFilesAsParameters(): boolean {
        const parameters: string[] = this.remoteProxy.getParameters();

        for (const parameter of parameters) {
            if (this.isSupportedAudioFile(parameter)) {
                return true;
            }
        }

        return false;
    }

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

    private isSupportedAudioFile(filePath: string): boolean {
        const fileExtension: string = this.fileSystem.getFileExtension(filePath);

        if (FileFormats.supportedAudioExtensions.includes(fileExtension.toLowerCase())) {
            return true;
        }

        return false;
    }
}
