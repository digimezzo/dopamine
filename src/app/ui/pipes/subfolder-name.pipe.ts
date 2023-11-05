import { Pipe, PipeTransform } from '@angular/core';
import {Strings} from "../../common/strings";
import {BaseFileAccess} from "../../common/io/base-file-access";
import {SubfolderModel} from "../../services/folder/subfolder-model";

@Pipe({ name: 'subfolderName' })
export class SubfolderNamePipe implements PipeTransform {
    public constructor(private fileAccess: BaseFileAccess) {}

    public transform(subfolder: SubfolderModel | undefined): string {
        if (subfolder == undefined) {
            return '';
        }

        if (subfolder.isGoToParent) {
            return '..';
        }

        if (Strings.isNullOrWhiteSpace(subfolder.path)) {
            return '';
        }

        return this.fileAccess.getDirectoryOrFileName(subfolder.path);
    }
}
