import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Constants } from '../../common/application/constants';
import { BaseSettings } from '../../common/settings/base-settings';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';

@Injectable()
export class CollectionPersister {
    private _selectedTab : string;
    
    private selectedTabChanged: Subject<void> = new Subject();

    constructor(private settings: BaseSettings) {
        this.initializeFromSettings();
    }

    public get selectedTab() : string {
        return this._selectedTab;
    }

    public set selectedTab(v : string) {
        this._selectedTab = v;
        this.settings.selectedCollectionTab = v;
        this.selectedTabChanged.next();
    }

    public selectedTabChanged$: Observable<void> = this.selectedTabChanged.asObservable();

    private initializeFromSettings(): void {
        this.selectedTab = this.settings.selectedCollectionTab;
    }
}
