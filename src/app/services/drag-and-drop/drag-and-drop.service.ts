import {Injectable} from "@angular/core";
import {BaseDragAndDropService} from "./base-drag-and-drop.service";

@Injectable()
export class DragAndDropService implements BaseDragAndDropService{
    public listenToOperatingSystemFileDrops(): void {
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        
        document.addEventListener('drop', (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            alert('Dropped file(s)');

            // let pathArr = [];
            // for (const f of event.dataTransfer.files) {
            //     // Using the path attribute to get absolute file path
            //     console.log('File Path of dragged files: ', f.path)
            //     pathArr.push(f.path); // assemble array for main.js
            // }
            // console.log(pathArr);
            // const ret = ipcRenderer.sendSync('dropped-file', pathArr);
            // console.log(ret);
        });
    }
    
}