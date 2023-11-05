import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../common/strings';
import { SubfolderModel } from '../services/folder/subfolder-model';
import {SearchServiceBase} from "../services/search/search.service.base";

@Pipe({ name: 'subfoldersFilter' })
export class SubfoldersFilterPipe implements PipeTransform {
    public constructor(private searchService: SearchServiceBase) {}

    public transform(subfolders: SubfolderModel[], textToContain: string | undefined): SubfolderModel[] {
        if (Strings.isNullOrWhiteSpace(textToContain)) {
            return subfolders;
        }

        const filteredSubfolders: SubfolderModel[] = [];

        for (const subfolder of subfolders) {
            if (this.searchService.matchesSearchText(subfolder.path, textToContain!)) {
                filteredSubfolders.push(subfolder);
            }
        }

        return filteredSubfolders;
    }
}
