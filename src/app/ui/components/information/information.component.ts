import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Constants } from '../../../common/application/constants';

@Component({
    selector: 'app-information',
    host: { style: 'display: block' },
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('pageSwitchAnimation', [
            state('fade-out', style({ opacity: 0 })),
            state('fade-in', style({ opacity: 1 })),
            transition('fade-in => fade-out', animate('10ms ease-out')),
            transition('fade-out => fade-in', animate(`${Constants.pageSwitchAnimationMilliseconds}ms ease-out`)),
        ]),
    ],
})
export class InformationComponent implements AfterViewInit {
    public constructor(public appearanceService: AppearanceServiceBase) {}

    public pageSwitchAnimation: string = 'fade-out';

    public ngAfterViewInit(): void {
        // HACK: avoids a ExpressionChangedAfterItHasBeenCheckedError in DEV mode.
        setTimeout(() => {
            this.pageSwitchAnimation = 'fade-in';
        }, 0);
    }
}
