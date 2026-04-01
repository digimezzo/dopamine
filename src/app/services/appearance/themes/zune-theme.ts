import { Theme } from '../theme/theme';
import { ThemeAuthor } from '../theme/theme-author';
import { ThemeCoreColors } from '../theme/theme-core-colors';
import { ThemeNeutralColors } from '../theme/theme-neutral-colors';
import { ThemeOptions } from '../theme/theme-options';
import { defaultDarkColors, defaultLightColors } from './default-neutral-colors';

export class ZuneTheme {
    public static create(author: ThemeAuthor): Theme {
        const darkColors: ThemeNeutralColors = defaultDarkColors();
        const lightColors: ThemeNeutralColors = defaultLightColors();

        darkColors.scrollBars = '#f0266f';
        lightColors.scrollBars = '#f0266f';

        const options: ThemeOptions = new ThemeOptions(false);

        return new Theme('Zune', author, new ThemeCoreColors('#f78f1e', '#ed008c', '#f0266f'), darkColors, lightColors, options);
    }
}
