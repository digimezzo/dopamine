import { Language } from './language';
import { ColorTheme } from './colorTheme';

export class Constants {
    public static readonly applicationName: string = require('../../../package.json').name;
    public static readonly applicationVersion: string = require('../../../package.json').version;
    public static readonly applicationCopyright: string = 'Copyright Digimezzo Ⓒ 2014 - 2019';
    public static readonly donateUrl: string = 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=MQALEWTEZ7HX8';
    public static readonly websiteUrl: string = 'https://www.digimezzo.com';
    public static readonly twitterUrl: string = 'https://twitter.com/digimezzo';
    public static readonly githubUrl: string = 'https://github.com/digimezzo';

    public static readonly languages: Language[] = [
        { code: 'en', name: 'English' },
        { code: 'fr', name: 'Français' }
    ];

    public static readonly colorThemes: ColorTheme[] = [
        { name: 'default-blue-theme', displayName: 'Blue', color: '#1d7dd4' },
        { name: 'default-green-theme', displayName: 'Green', color: '#1db853' },
        { name: 'default-yellow-theme', displayName: 'Yellow', color: '#ff9626' },
        { name: 'default-purple-theme', displayName: 'Purple', color: '#7a4aba' },
        { name: 'default-pink-theme', displayName: 'Pink', color: '#ee205e' },
    ];
}
