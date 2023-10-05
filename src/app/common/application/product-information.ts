/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const { getName, getFullVersion, getCopyright } = require('../../../../get-package-information.js');

export class ProductInformation {
    public static readonly applicationName: string = getName();
    public static readonly applicationVersion: string = getFullVersion();
    public static readonly applicationCopyright: string = getCopyright();
    public static readonly releasesDownloadUrl: string = 'https://github.com/digimezzo/dopamine/releases/';
}
