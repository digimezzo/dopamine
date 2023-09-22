import { Strings } from '../strings';

export class ExternalComponent {
    public constructor(public name: string, public description: string, public url: string, public licenseUrl: string) {}

    public get hasLicenseUrl(): boolean {
        return !Strings.isNullOrWhiteSpace(this.licenseUrl);
    }
}
