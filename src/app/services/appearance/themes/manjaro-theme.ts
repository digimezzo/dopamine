import { Theme } from '../theme/theme';
import { ThemeAuthor } from '../theme/theme-author';
import { ThemeCoreColors } from '../theme/theme-core-colors';
import { ThemeNeutralColors } from '../theme/theme-neutral-colors';
import { ThemeOptions } from '../theme/theme-options';

export class ManjaroTheme {
    public static create(author: ThemeAuthor): Theme {
        const darkColors: ThemeNeutralColors = new ThemeNeutralColors(
            'white',
            'rgba(255, 255, 255, 0.05)',
            'rgba(255, 255, 255, 0.1)',
            '#818181',
            'white',
            '#2d2d2d',
            '#313131',
            '#313131',
            '#313131',
            'white',
            '#818181',
            '#464646',
            'white',
            '#272727',
            '#1b1b1b',
            '#1b1b1b',
            '#1b1b1b',
            '#1b1b1b',
            '#7a7a79',
            '#373737',
            '#fff',
            '#fff',
            '#313131',
            '#fff',
            '#555',
            '#fff',
            '#fff',
            '#555',
            '#fff',
        );

        const lightColors: ThemeNeutralColors = new ThemeNeutralColors(
            'black',
            'rgba(0, 0, 0, 0.05)',
            'rgba(0, 0, 0, 0.1)',
            '#838383',
            'black',
            'white',
            '#fafafa',
            '#fafafa',
            '#fafafa',
            'black',
            '#838383',
            '#dcdcdc',
            'black',
            '#cecece',
            '#c7c7c7',
            '#c7c7c7',
            '#c7c7c7',
            '#c7c7c7',
            '#abaeaf',
            '#e7e7e7',
            '#000',
            '#000',
            '#fafafa',
            '#fff',
            '#c7c7c7',
            '#000',
            '#fff',
            '#c7c7c7',
            '#fff',
        );

        const options: ThemeOptions = new ThemeOptions(true);

        return new Theme('Manjaro', author, new ThemeCoreColors('#009378', '#2eae92', '#16a085'), darkColors, lightColors, options);
    }
}
