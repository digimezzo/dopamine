import { Language } from './language';
import { FontSize } from './font-size';

export class Constants {
    public static readonly donateUrl: string = 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=MQALEWTEZ7HX8';
    public static readonly websiteUrl: string = 'https://www.digimezzo.com';
    public static readonly twitterUrl: string = 'https://twitter.com/digimezzo';
    public static readonly githubUrl: string = 'https://github.com/digimezzo';

    public static readonly languages: Language[] = [
        new Language('en', 'English'),
        new Language('fr', 'Français'),
        new Language('nl', 'Nederlands')
    ];

    public static readonly fontSizes: FontSize[] = [
        new FontSize(13),
        new FontSize(14),
        new FontSize(15)
    ];
}
