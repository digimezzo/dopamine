import { Injectable } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ISelectable } from '../ui/interfaces/i-selectable';

@Injectable()
export class ContextMenuOpener {
    public positionX: string = '0px';
    public positionY: string = '0px';

    public open(contextMenu: MatMenuTrigger, event: MouseEvent, selectable: ISelectable): void {
        event.preventDefault();

        this.positionX = `${event.clientX}px`;
        this.positionY = `${event.clientY}px`;

        contextMenu.menuData = { data: selectable };
        contextMenu.menu?.focusFirstItem('mouse');
        contextMenu.openMenu();
    }
}
