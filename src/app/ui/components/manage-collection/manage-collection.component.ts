import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Constants } from '../../../common/application/constants';

@Component({
    selector: 'app-manage-collection',
    templateUrl: './manage-collection.component.html',
    styleUrls: ['./manage-collection.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('pageSwitchAnimation', [
            state('fade-out', style({ opacity: 0 })),
            state('fade-in', style({ opacity: 1 })),
            transition('fade-in => fade-out', animate('10ms ease-out')),
            transition('fade-out => fade-in', animate(`${Constants.pageSwitchAnimationMilliseconds}ms ease-out`)),
        ]),
        trigger('enterAnimation', [
            transition(':enter', [
                style({ 'margin-left': '{{marginLeft}}', 'margin-right': '{{marginRight}}', opacity: 0 }),
                animate(`${Constants.screenEaseSpeedMilliseconds}ms ease-out`, style({ 'margin-left': 0, 'margin-right': 0, opacity: 1 })),
            ]),
        ]),
    ],
})
export class ManageCollectionComponent implements AfterViewInit {
    public constructor(public appearanceService: AppearanceServiceBase) {}

    public pageSwitchAnimation: string = 'fade-out';
    public page: number = 0;
    public marginLeft: string = '0px';
    public marginRight: string = '0px';

    public ngAfterViewInit(): void {
        // HACK: avoids a ExpressionChangedAfterItHasBeenCheckedError in DEV mode.
        setTimeout(() => {
            this.pageSwitchAnimation = 'fade-in';
        }, 0);
    }

    public setPage(page: number): void {
        let marginToApply: number = Constants.screenEaseMarginPixels;

        if (this.page < page) {
            marginToApply = -Constants.screenEaseMarginPixels;
        }

        this.marginLeft = `${marginToApply}px`;
        this.marginRight = `${-marginToApply}px`;

        this.page = page;
    }
}
