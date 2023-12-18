import { trigger, transition, style, animate } from '@angular/animations';
import { Constants } from '../../common/application/constants';

export const enterLeftToRight = trigger('enterLeftToRight', [
    transition(':enter', [
        style({ 'margin-left': '-50px', 'margin-right': '50px', opacity: 0 }),
        animate(`${Constants.screenEaseSpeedMilliseconds}ms ease-out`, style({ 'margin-left': 0, 'margin-right': 0, opacity: 1 })),
    ]),
]);

export const enterRightToLeft = trigger('enterRightToLeft', [
    transition(':enter', [
        style({ 'margin-left': '50px', 'margin-right': '-50px', opacity: 0 }),
        animate(`${Constants.screenEaseSpeedMilliseconds}ms ease-out`, style({ 'margin-left': 0, 'margin-right': 0, opacity: 1 })),
    ]),
]);
