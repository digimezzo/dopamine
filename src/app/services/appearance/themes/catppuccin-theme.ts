import { Theme } from '../theme/theme';
import { ThemeAuthor } from '../theme/theme-author';
import { ThemeCoreColors } from '../theme/theme-core-colors';
import { ThemeNeutralColors } from '../theme/theme-neutral-colors';
import { ThemeOptions } from '../theme/theme-options';

export class CatppuccinTheme {
    public static create(author: ThemeAuthor): Theme {
        const darkColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#bac2de',
            'rgba(205, 214, 244, 0.1)',
            'rgba(205, 214, 244, 0.2)',
            '#a6adc8',
            '#cdd6f4',
            '#1e1e2e',
            '#181825',
            '#181825',
            '#181825',
            '#cdd6f4',
            '#a6adc8',
            '#313244',
            '#cdd6f4',
            '#313244',
            'transparent',
            'transparent',
            '#313244',
            '#313244',
            '#cba6f7',
            '#313244',
            '#cdd6f4',
            '#a6adc8',
            '#181825',
            '#1e1e2e',
            '#313244',
            '#cdd6f4',
            '#313244',
            '#313244',
            '#11111b',
        );

        const lightColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#9ca0b0',
            'rgba(76, 79, 105, 0.1)',
            'rgba(76, 79, 105, 0.2)',
            '#6c6f85',
            '#4c4f69',
            '#eff1f5',
            '#e6e9ef',
            '#e6e9ef',
            '#e6e9ef',
            '#4c4f69',
            '#6c6f85',
            '#ccd0da',
            '#4c4f69',
            '#ccd0da',
            'transparent',
            'transparent',
            '#ccd0da',
            '#ccd0da',
            '#8839ef',
            '#ccd0da',
            '#4c4f69',
            '#6c6f85',
            '#e6e9ef',
            '#eff1f5',
            '#acb0be',
            '#4c4f69',
            '#4c4f69',
            '#acb0be',
            '#4c4f69',
        );

        const options: ThemeOptions = new ThemeOptions(true);

        return new Theme('Catppuccin', author, new ThemeCoreColors('#cba6f7', '#f5c2e7', '#cba6f7'), darkColors, lightColors, options);
    }
}
