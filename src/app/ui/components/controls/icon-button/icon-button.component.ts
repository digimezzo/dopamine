import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-icon-button',
    templateUrl: './icon-button.component.html',
    styleUrls: ['./icon-button.component.scss'],
})
export class IconButtonComponent {
    public iconUrl: string | undefined;

    @Input() public set icon(value: string) {
        const iconName: string | undefined = value
            ?.split(' ')
            .find((className: string) => className.startsWith('la-'))
            ?.substring(3);

        if (iconName == undefined) {
            this.iconUrl = undefined;
            return;
        }

        const iconStyleSuffix: string = value.split(' ').includes('las') ? '-solid' : '';
        this.iconUrl = `url('./assets/line-awesome/svg/${iconName}${iconStyleSuffix}.svg')`;
    }
}
