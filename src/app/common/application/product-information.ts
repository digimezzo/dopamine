export class ProductInformation {
    public static readonly applicationName: string = require('../../../../package.json').name;
    public static readonly applicationVersion: string = require('../../../../package.json').version;
    public static readonly applicationCopyright: string = require('../../../../package.json').copyright;
    public static readonly releasesDownloadUrl: string = 'https://github.com/digimezzo/dopamine/releases/';
}
