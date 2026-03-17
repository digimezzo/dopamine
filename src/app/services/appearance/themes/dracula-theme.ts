import { Theme } from '../theme/theme';
import { ThemeAuthor } from '../theme/theme-author';
import { ThemeCoreColors } from '../theme/theme-core-colors';
import { ThemeNeutralColors } from '../theme/theme-neutral-colors';
import { ThemeOptions } from '../theme/theme-options';

export class DraculaTheme {
    public static create(author: ThemeAuthor): Theme {
        const darkColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#6272a4',
            'rgba(189, 147, 249, 0.1)',
            'rgba(189, 147, 249, 0.2)',
            '#6272a4',
            '#f8f8f2',
            '#282a36',
            '#21222c',
            '#21222c',
            '#21222c',
            '#f8f8f2',
            '#6272a4',
            '#44475a',
            '#f8f8f2',
            '#44475a',
            'transparent',
            'transparent',
            '#44475a',
            '#44475a',
            '#bd93f9',
            '#44475a',
            '#f8f8f2',
            '#6272a4',
            '#21222c',
            '#282a36',
            '#44475a',
            '#f8f8f2',
            '#f8f8f2',
            '#44475a',
            '#f8f8f2',
        );

        const lightColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#6272a4',
            'rgba(98, 114, 164, 0.1)',
            'rgba(98, 114, 164, 0.2)',
            '#6272a4',
            '#282a36',
            '#f8f8f2',
            '#e2e4e9',
            '#e2e4e9',
            '#e2e4e9',
            '#282a36',
            '#44475a',
            '#e2e4e9',
            '#282a36',
            '#e2e4e9',
            'transparent',
            'transparent',
            '#dcdcdc',
            '#dcdcdc',
            '#644ac9',
            '#e2e4e9',
            '#282a36',
            '#6272a4',
            '#f8f8f2',
            '#f8f8f2',
            '#dcdcdc',
            '#282a36',
            '#282a36',
            '#dcdcdc',
            '#f8f8f2',
        );

        const options: ThemeOptions = new ThemeOptions(true);

        return new Theme('Dracula', author, new ThemeCoreColors('#bd93f9', '#ff79c6', '#bd93f9'), darkColors, lightColors, options);
    }
}
