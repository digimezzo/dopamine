import { trigger, transition, style, animate } from '@angular/animations';
import { Constants } from '../../common/application/constants';

export const enterAnimation = trigger('enterAnimation', [
    transition(':enter', [
        style({ 'margin-left': '-50px', 'margin-right': '50px', opacity: 0 }),
        animate(`${Constants.screenEaseSpeedMilliseconds}ms ease-out`, style({ 'margin-left': 0, 'margin-right': 0, opacity: 1 })),
    ]),
]);
