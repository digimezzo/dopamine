import { FontSize } from './font-size';
import { Language } from './language';

export class Constants {
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
