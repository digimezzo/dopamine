import { Directive, HostListener, Input, NgZone, OnDestroy } from '@angular/core';
import * as remote from '@electron/remote';

@Directive({
    selector: '[appWindowDraggable]',
})
export class WindowDraggableDirective implements OnDestroy {
    @Input() public appWindowDraggableDisabled: boolean = false;
    private isDragging = false;
    private startScreenX = 0;
    private startScreenY = 0;
    private startWinX = 0;
    private startWinY = 0;

    public constructor(private zone: NgZone) {}

    @HostListener('mousedown', ['$event'])
    public onMouseDown(event: MouseEvent): void {
        if (event.button !== 0 || this.appWindowDraggableDisabled) {
            return;
        }

        this.startScreenX = event.screenX;
        this.startScreenY = event.screenY;

        const win = remote.getCurrentWindow();
        const [winX, winY] = win.getPosition();
        this.startWinX = winX;
        this.startWinY = winY;
        this.isDragging = false;

        this.zone.runOutsideAngular(() => {
            document.addEventListener('mousemove', this.onMouseMove);
            document.addEventListener('mouseup', this.onMouseUp);
        });
    }

    private onMouseMove = (event: MouseEvent): void => {
        const dx = event.screenX - this.startScreenX;
        const dy = event.screenY - this.startScreenY;

        if (!this.isDragging && Math.abs(dx) < 3 && Math.abs(dy) < 3) {
            return;
        }

        if (!this.isDragging) {
            this.isDragging = true;
            document.documentElement.classList.add('dragging');
            const active = document.activeElement as HTMLElement;
            if (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA') {
                active.blur();
            }
        }

        event.preventDefault();

        const win = remote.getCurrentWindow();
        if (win.isMaximized()) {
            win.unmaximize();
            const [width] = win.getSize();
            this.startWinX = event.screenX - width / 2;
            this.startWinY = event.screenY;
            win.setPosition(this.startWinX, this.startWinY);
            this.startScreenX = event.screenX;
            this.startScreenY = event.screenY;
        } else {
            win.setPosition(this.startWinX + dx, this.startWinY + dy);
        }
    };

    private onMouseUp = (): void => {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);

        if (this.isDragging) {
            this.isDragging = false;
            document.documentElement.classList.remove('dragging');
            document.addEventListener('click', this.suppressClick, true);
        }
    };

    private suppressClick = (event: MouseEvent): void => {
        event.stopPropagation();
        event.preventDefault();
        event.stopImmediatePropagation();
        document.removeEventListener('click', this.suppressClick, true);
    };

    public ngOnDestroy(): void {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('click', this.suppressClick, true);
    }
}
