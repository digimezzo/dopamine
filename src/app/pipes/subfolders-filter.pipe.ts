import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../common/strings';
import { SubfolderModel } from '../services/folder/subfolder-model';
import { BaseFilterPipe } from './base-filter.pipe';

@Pipe({ name: 'subfoldersFilter' })
export class SubfoldersFilterPipe extends BaseFilterPipe implements PipeTransform {
    constructor() {
        super();
    }

    public transform(subfolders: SubfolderModel[], textToContain: string): SubfolderModel[] {
        if (Strings.isNullOrWhiteSpace(textToContain)) {
            return subfolders;
        }

        const filteredSubfolders: SubfolderModel[] = [];

        for (const subfolder of subfolders) {
            if (this.containsText(subfolder.path, textToContain)) {
                filteredSubfolders.push(subfolder);
            }
        }

        return filteredSubfolders;
    }
}
