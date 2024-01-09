import { Component, ViewEncapsulation } from '@angular/core';
import { Constants } from '../../../../common/application/constants';
import { ExternalComponent } from '../../../../common/application/external-component';
import { DesktopBase } from '../../../../common/io/desktop.base';

@Component({
    selector: 'app-components',
    host: { style: 'display: block; width: 100%;' },
    templateUrl: './components.component.html',
    styleUrls: ['./components.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ComponentsComponent {
    public externalComponents: ExternalComponent[] = Constants.externalComponents;

    public constructor(private desktop: DesktopBase) {}

    public async browseToUrlAsync(url: string): Promise<void> {
        await this.desktop.openLinkAsync(url);
    }
}
