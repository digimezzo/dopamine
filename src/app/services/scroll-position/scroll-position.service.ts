import { Injectable } from '@angular/core';
import { SearchServiceBase } from '../search/search.service.base';
import { StringUtils } from '../../common/utils/string-utils';
import { SettingsBase } from '../../common/settings/settings.base';

@Injectable({ providedIn: 'root' })
export class ScrollPositionService {
    private scrollPositions: Map<string, number> = new Map<string, number>();

    public constructor(
        private searchService: SearchServiceBase,
        private settings: SettingsBase,
    ) {}

    public getScrollPosition(key: string): number {
        if (!this.settings.rememberScrollPosition || !StringUtils.isNullOrWhiteSpace(this.searchService.delayedSearchText)) {
            return 0;
        }

        return this.scrollPositions.get(key) ?? 0;
    }

    public setScrollPosition(key: string, scrollPosition: number): void {
        if (!this.settings.rememberScrollPosition || !StringUtils.isNullOrWhiteSpace(this.searchService.delayedSearchText)) {
            return;
        }

        this.scrollPositions.set(key, scrollPosition);
    }
}
