import { Theme } from '../theme/theme';
import { ThemeAuthor } from '../theme/theme-author';
import { ThemeCoreColors } from '../theme/theme-core-colors';
import { ThemeNeutralColors } from '../theme/theme-neutral-colors';
import { ThemeOptions } from '../theme/theme-options';

export class PalenightTheme {
    public static create(author: ThemeAuthor): Theme {
        const darkColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#7b83a7',
            'rgba(255, 255, 255, 0.05)',
            'rgba(255, 255, 255, 0.1)',
            '#7b83a7',
            '#fbfdfd',
            '#2f3447',
            '#272b3b',
            '#272b3b',
            '#2b3042',
            '#fbfdfd',
            '#7b83a7',
            '#393d4a',
            '#fff',
            '#212433',
            'transparent',
            'transparent',
            '#282c3d',
            '#31364a',
            '#00908c',
            '#2f3447',
            '#fbfdfd',
            '#7b83a7',
            '#272b3b',
            '#fff',
            '#53586f',
            '#fff',
            '#fff',
            '#53586f',
            '#fff',
        );

        const lightColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#7b83a7',
            'rgba(255, 255, 255, 0.05)',
            'rgba(0, 0, 0, 0.1)',
            '#7b83a7',
            '#fbfdfd',
            '#2f3447',
            '#272b3b',
            '#272b3b',
            '#2b3042',
            '#fbfdfd',
            '#7b83a7',
            '#393d4a',
            '#fff',
            '#212433',
            'transparent',
            'transparent',
            '#282c3d',
            '#31364a',
            '#00908c',
            '#2f3447',
            '#fbfdfd',
            '#7b83a7',
            '#272b3b',
            '#fff',
            '#282c3d',
            '#fff',
            '#fff',
            '#282c3d',
            '#fff',
        );

        const options: ThemeOptions = new ThemeOptions(true);

        return new Theme('Palenight', author, new ThemeCoreColors('#008884', '#56c6c1', '#00908c'), darkColors, lightColors, options);
    }
}
