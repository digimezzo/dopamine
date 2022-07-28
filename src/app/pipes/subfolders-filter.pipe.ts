import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../common/strings';
import { SubfolderModel } from '../services/folder/subfolder-model';
import { BaseSearchService } from '../services/search/base-search.service';

@Pipe({ name: 'subfoldersFilter' })
export class SubfoldersFilterPipe implements PipeTransform {
    constructor(private searchService: BaseSearchService) {}

    public transform(subfolders: SubfolderModel[], textToContain: string): SubfolderModel[] {
        if (Strings.isNullOrWhiteSpace(textToContain)) {
            return subfolders;
        }

        const filteredSubfolders: SubfolderModel[] = [];

        for (const subfolder of subfolders) {
            if (this.searchService.matchesSearchText(subfolder.path, textToContain)) {
                filteredSubfolders.push(subfolder);
            }
        }

        return filteredSubfolders;
    }
}
