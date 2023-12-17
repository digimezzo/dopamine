import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Constants } from '../../../../common/application/constants';

@Component({
    selector: 'app-metro-page',
    host: { style: 'display: block' },
    templateUrl: './metro-page.component.html',
    styleUrls: ['./metro-page.component.scss'],
    animations: [
        trigger('enterAnimation', [
            transition(':enter', [
                style({ 'margin-left': '{{marginLeft}}', 'margin-right': '{{marginRight}}', opacity: 0 }),
                animate(`${Constants.screenEaseSpeedMilliseconds}ms ease-out`, style({ 'margin-left': 0, 'margin-right': 0, opacity: 1 })),
            ]),
        ]),
    ],
    styles: [
        `
            :host(.wide) {
                width: 100%;
            }
        `,
    ],
})
export class MetroPageComponent {
    private _page: number;
    private _selectedPage: number;

    public previouslySelectedPage: number = -1;

    public marginLeft: string = '0px';
    public marginRight: string = '0px';

    public constructor(
        private renderer: Renderer2,
        private el: ElementRef,
    ) {}

    public get page(): number {
        return this._page;
    }
    @Input()
    public set page(value: number) {
        this._page = value;

        if (this._page === this._selectedPage) {
            this.renderer.addClass(this.el.nativeElement, 'wide');
        } else {
            this.renderer.removeClass(this.el.nativeElement, 'wide');
        }
    }

    public get selectedPage(): number {
        return this._selectedPage;
    }
    @Input()
    public set selectedPage(value: number) {
        this.previouslySelectedPage = this._selectedPage;
        this.applyMargins();
        this._selectedPage = value;

        if (this._page === this._selectedPage) {
            this.renderer.addClass(this.el.nativeElement, 'wide');
        } else {
            this.renderer.removeClass(this.el.nativeElement, 'wide');
        }
    }

    public applyMargins(): void {
        let marginToApply: number = -Constants.screenEaseMarginPixels;

        if (this.previouslySelectedPage > this.page) {
            marginToApply = Constants.screenEaseMarginPixels;
        }

        this.marginLeft = `${marginToApply}px`;
        this.marginRight = `${-marginToApply}px`;
    }
}
