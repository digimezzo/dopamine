import { Injectable } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

@Injectable()
export class TabSelectionGetter {
    constructor() {}

    public getTabLabelForIndex(tabGroup: MatTabGroup, tabIndex: number): string { 
        if (tabGroup == undefined || tabGroup._tabs == undefined) {
            return '';
        }

        let selectedTab:MatTab = tabGroup._tabs.toArray().find((tab: MatTab) => tabGroup._tabs.toArray().indexOf(tab) === tabIndex);
      
        if(selectedTab != undefined){
            return selectedTab.textLabel;
        }

        return '';
    }

    public getTabIndexForLabel(tabGroup: MatTabGroup, tabLabel: string): number {
        if (tabGroup == undefined || tabGroup._tabs == undefined) {
            return 0;
        }

        let selectedTab:MatTab = tabGroup._tabs.toArray().find((tab: MatTab) => tab.textLabel === tabLabel);
      
        if(selectedTab != undefined){
           return tabGroup._tabs.toArray().indexOf(selectedTab);
        } 

        return 0;
    }
}
