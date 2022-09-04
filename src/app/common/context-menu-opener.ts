import { Injectable } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Injectable()
export class ContextMenuOpener {
    constructor() {}

    public positionX: string = '0px';
    public positionY: string = '0px';

    public open(contextMenu: MatMenuTrigger, event: MouseEvent, data: any): void {
        event.preventDefault();

        this.positionX = event.clientX + 'px';
        this.positionY = event.clientY + 'px';

        contextMenu.menuData = { data: data };
        contextMenu.menu.focusFirstItem('mouse');
        contextMenu.openMenu();
    }
}
