import { Theme } from '../theme/theme';
import { ThemeAuthor } from '../theme/theme-author';
import { ThemeCoreColors } from '../theme/theme-core-colors';
import { ThemeNeutralColors } from '../theme/theme-neutral-colors';
import { ThemeOptions } from '../theme/theme-options';
import { defaultDarkColors, defaultLightColors } from './default-neutral-colors';

export class NaughtyTheme {
    public static create(author: ThemeAuthor): Theme {
        const darkColors: ThemeNeutralColors = defaultDarkColors();
        const lightColors: ThemeNeutralColors = defaultLightColors();

        darkColors.scrollBars = '#f5004a';
        lightColors.scrollBars = '#f5004a';

        const options: ThemeOptions = new ThemeOptions(false);

        return new Theme('Naughty', author, new ThemeCoreColors('#f5004a', '#9300ef', '#f5004a'), darkColors, lightColors, options);
    }
}
