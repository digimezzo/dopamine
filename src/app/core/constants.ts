import { Language } from './language';

export class Constants {
    public static readonly applicationName: string = require('../../../package.json').name;
    public static readonly applicationVersion: string = require('../../../package.json').version;
    public static readonly applicationCopyright: string = 'Copyright Digimezzo Ⓒ 2014 - 2019';
    public static readonly donateUrl: string = 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=MQALEWTEZ7HX8';
    public static readonly websiteUrl: string = 'https://www.digimezzo.com';
    public static readonly twitterUrl: string = 'https://twitter.com/digimezzo';
    public static readonly githubUrl: string = 'https://github.com/digimezzo';

    public static readonly languages: Language[] = [
        new Language('en', 'English'),
        new Language('fr', 'Français')
    ];
}
