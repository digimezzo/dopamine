import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../common/strings';
import { SubfolderModel } from '../services/folder/subfolder-model';

@Pipe({ name: 'subfoldersFilter' })
export class SubfoldersFilterPipe implements PipeTransform {
    constructor() {}

    public transform(subfolders: SubfolderModel[], filterTerm: string): SubfolderModel[] {
        if (Strings.isNullOrWhiteSpace(filterTerm)) {
            return subfolders;
        }

        const filteredSubfolders: SubfolderModel[] = [];

        for (const subfolder of subfolders) {
            if (subfolder.path.toLowerCase().includes(filterTerm.toLowerCase())) {
                filteredSubfolders.push(subfolder);
            }
        }

        return filteredSubfolders;
    }
}
