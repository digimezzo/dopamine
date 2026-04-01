import { Theme } from '../theme/theme';
import { ThemeAuthor } from '../theme/theme-author';
import { ThemeCoreColors } from '../theme/theme-core-colors';
import { ThemeNeutralColors } from '../theme/theme-neutral-colors';
import { ThemeOptions } from '../theme/theme-options';
import { defaultDarkColors, defaultLightColors } from './default-neutral-colors';

export class BeatsTheme {
    public static create(author: ThemeAuthor): Theme {
        const darkColors: ThemeNeutralColors = defaultDarkColors();
        const lightColors: ThemeNeutralColors = defaultLightColors();

        darkColors.scrollBars = '#e21839';
        lightColors.scrollBars = '#e21839';

        const options: ThemeOptions = new ThemeOptions(false);

        return new Theme('Beats', author, new ThemeCoreColors('#98247f', '#e21839', '#e21839'), darkColors, lightColors, options);
    }
}
