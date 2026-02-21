/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { StringUtils } from '../utils/string-utils';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const { getName, getFullVersion, getCopyright } = require('../../../../get-package-information.js');

export class ProductInformation {
    public static readonly applicationName: string = StringUtils.capitalizeFirstLetter(getName() as string);
    public static readonly applicationVersion: string = getFullVersion();
    public static readonly applicationCopyright: string = getCopyright();
    public static readonly releasesDownloadUrl: string = 'https://github.com/digimezzo/dopamine/releases/';
}
