import { Theme } from '../theme/theme';
import { ThemeAuthor } from '../theme/theme-author';
import { ThemeCoreColors } from '../theme/theme-core-colors';
import { ThemeNeutralColors } from '../theme/theme-neutral-colors';
import { ThemeOptions } from '../theme/theme-options';

export class AdwaitaTheme {
    public static create(author: ThemeAuthor): Theme {
        const darkColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#ffffff',
            'rgba(255, 255, 255, 0.06)',
            'rgba(255, 255, 255, 0.12)',
            '#c0bfbc',
            '#ffffff',
            '#1e1e1e',
            '#303030',
            '#303030',
            '#242424',
            '#ffffff',
            '#c0bfbc',
            '#3d3d3d',
            '#ffffff',
            '#2b2b2b',
            'rgba(255, 255, 255, 0.08)',
            'rgba(255, 255, 255, 0.08)',
            '#454545',
            '#454545',
            '#3584e4',
            '#3a3a3a',
            '#ffffff',
            '#c0bfbc',
            '#2f2f2f',
            '#ffffff',
            '#4a4a4a',
            '#ffffff',
            '#ffffff',
            '#4a4a4a',
            '#ffffff',
        );

        const lightColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#2e3436',
            'rgba(46, 52, 54, 0.06)',
            'rgba(46, 52, 54, 0.12)',
            '#5e5c64',
            '#1b1b1b',
            '#f6f5f4',
            '#ebebeb',
            '#ebebeb',
            '#ffffff',
            '#1b1b1b',
            '#5e5c64',
            '#d8d7d3',
            '#1b1b1b',
            '#e7e5e4',
            '#d9d7d3',
            '#d9d7d3',
            '#d4d2cd',
            '#d4d2cd',
            '#3584e4',
            '#ffffff',
            '#1b1b1b',
            '#5e5c64',
            '#ffffff',
            '#ffffff',
            '#d4d2cd',
            '#1b1b1b',
            '#ffffff',
            '#d4d2cd',
            '#ffffff',
        );

        const options: ThemeOptions = new ThemeOptions(true);

        return new Theme('Adwaita', author, new ThemeCoreColors('#3584e4', '#5ca4ff', '#3584e4'), darkColors, lightColors, options);
    }
}
