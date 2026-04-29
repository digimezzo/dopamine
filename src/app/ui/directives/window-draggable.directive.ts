import { Directive, HostBinding, HostListener, Input, NgZone, OnDestroy } from '@angular/core';
import * as remote from '@electron/remote';
import { AppearanceServiceBase } from '../../services/appearance/appearance.service.base';

// NOTE: This directive does not work on Wayland due to how Wayland manages window positioning.
// Wayland does not allow applications to set their own window position, so dragging has no effect.
@Directive({
    selector: '[appWindowDraggable]',
})
export class WindowDraggableDirective implements OnDestroy {
    @Input() public appWindowDraggableDisabled: boolean = false;
    private readonly isWindows: boolean = remote.process.platform === 'win32';
    @HostBinding('class.app-window-draggable-dragging')
    public isDragging = false;
    private startScreenX = 0;
    private startScreenY = 0;
    private startWinX = 0;
    private startWinY = 0;
    private startWinWidth = 0;
    private startWinHeight = 0;

    public constructor(
        private zone: NgZone,
        private appearanceService: AppearanceServiceBase,
    ) {}

    @HostBinding('class.app-window-draggable')
    public get isDraggable(): boolean {
        return !this.appWindowDraggableDisabled && !this.appearanceService.windowHasNativeTitleBar;
    }

    @HostListener('mousedown', ['$event'])
    public onMouseDown(event: MouseEvent): void {
        if (event.button !== 0 || !this.isDraggable) {
            return;
        }

        this.startScreenX = event.screenX;
        this.startScreenY = event.screenY;

        const win = remote.getCurrentWindow();
        const [winX, winY] = win.getPosition();
        const [winWidth, winHeight] = win.getSize();
        this.startWinX = winX;
        this.startWinY = winY;
        this.startWinWidth = winWidth;
        this.startWinHeight = winHeight;
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
            const active = document.activeElement as HTMLElement;
            if (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA') {
                active.blur();
            }
        }

        event.preventDefault();

        const win = remote.getCurrentWindow();
        if (win.isMaximized()) {
            win.unmaximize();
            const [width, height] = win.getSize();
            this.startWinX = event.screenX - width / 2;
            this.startWinY = event.screenY;
            this.startWinWidth = width;
            this.startWinHeight = height;

            if (this.isWindows) {
                win.setBounds({
                    x: Math.round(this.startWinX),
                    y: Math.round(this.startWinY),
                    width: this.startWinWidth,
                    height: this.startWinHeight,
                });
            } else {
                win.setPosition(this.startWinX, this.startWinY);
            }

            this.startScreenX = event.screenX;
            this.startScreenY = event.screenY;
        } else {
            const nextX = Math.round(this.startWinX + dx);
            const nextY = Math.round(this.startWinY + dy);

            if (this.isWindows) {
                win.setBounds({
                    x: nextX,
                    y: nextY,
                    width: this.startWinWidth,
                    height: this.startWinHeight,
                });
            } else {
                win.setPosition(nextX, nextY);
            }
        }
    };

    private onMouseUp = (): void => {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);

        if (this.isDragging) {
            this.isDragging = false;
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
        this.isDragging = false;
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('click', this.suppressClick, true);
    }
}
