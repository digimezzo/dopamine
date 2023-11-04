import { Injectable } from '@angular/core';
import { BaseDragAndDropService } from './base-drag-and-drop.service';

@Injectable()
export class DragAndDropService implements BaseDragAndDropService {
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

            for (const f of event.dataTransfer.files) {
                alert(`Dropped file: ${f.path}`);
            }
        });
    }
}
