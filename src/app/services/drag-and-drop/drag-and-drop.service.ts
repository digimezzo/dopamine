import { Injectable } from '@angular/core';
import { BaseDragAndDropService } from './base-drag-and-drop.service';
import { BaseFileService } from '../file/base-file.service';
import { PromiseUtils } from '../../common/utils/promise-utils';

@Injectable()
export class DragAndDropService implements BaseDragAndDropService {
    public constructor(private fileService: BaseFileService) {}

    public listenToOperatingSystemFileDrops(): void {
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        document.addEventListener('drop', (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (event.dataTransfer == undefined) {
                return;
            }

            const filePaths: string[] = [];

            for (const f of event.dataTransfer.files) {
                filePaths.push(f.path);
            }

            PromiseUtils.noAwait(this.fileService.enqueueGivenParameterFilesAsync(filePaths));
        });
    }
}
