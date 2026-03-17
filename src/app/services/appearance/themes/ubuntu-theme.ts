import { Theme } from '../theme/theme';
import { ThemeAuthor } from '../theme/theme-author';
import { ThemeCoreColors } from '../theme/theme-core-colors';
import { ThemeNeutralColors } from '../theme/theme-neutral-colors';
import { ThemeOptions } from '../theme/theme-options';

export class UbuntuTheme {
    public static create(author: ThemeAuthor): Theme {
        const darkColors: ThemeNeutralColors = new ThemeNeutralColors(
            'white',
            'rgba(255, 255, 255, 0.05)',
            'rgba(255, 255, 255, 0.1)',
            '#7b7b7b',
            'white',
            '#2c2c2c',
            '#272727',
            '#272727',
            '#272727',
            'white',
            '#7b7b7b',
            '#3e3e3e',
            'white',
            '#202020',
            '#151515',
            '#151515',
            '#151515',
            '#151515',
            '#7d7d7d',
            '#373737',
            '#fff',
            '#fff',
            '#272727',
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
            '#8c8c8c',
            'black',
            'white',
            '#fafafa',
            '#fafafa',
            '#fafafa',
            'black',
            '#8c8c8c',
            '#dcdcdc',
            'black',
            '#cecece',
            '#dadada',
            '#dadada',
            '#dadada',
            '#dadada',
            '#b1b1b1',
            '#e9e9e9',
            'black',
            'black',
            '#fafafa',
            '#fff',
            '#dadada',
            '#000',
            '#fff',
            '#dadada',
            '#fff',
        );

        const options: ThemeOptions = new ThemeOptions(true);

        return new Theme('Ubuntu', author, new ThemeCoreColors('#d94612', '#f9622d', '#e95420'), darkColors, lightColors, options);
    }
}
