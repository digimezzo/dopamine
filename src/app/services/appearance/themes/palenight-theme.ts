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
            '#8087a2',
            'rgba(0, 0, 0, 0.05)',
            'rgba(0, 0, 0, 0.1)',
            '#8087a2',
            '#2f3447',
            '#e8eaf0',
            '#f0f1f5',
            '#f0f1f5',
            '#dfe2ea',
            '#2f3447',
            '#7b83a7',
            '#c8ccda',
            '#333',
            '#cdd1de',
            'transparent',
            'transparent',
            '#d0d4e0',
            '#d0d4e0',
            '#00908c',
            '#dfe2ea',
            '#2f3447',
            '#7b83a7',
            '#f0f1f5',
            '#fff',
            '#d0d4e0',
            '#2f3447',
            '#fff',
            '#d0d4e0',
            '#fff',
        );

        const options: ThemeOptions = new ThemeOptions(true);

        return new Theme('Palenight', author, new ThemeCoreColors('#008884', '#56c6c1', '#00908c'), darkColors, lightColors, options);
    }
}
