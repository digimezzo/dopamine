import { Injectable } from '@angular/core';
import { Theme } from './theme/theme';
import { ThemeCoreColors } from './theme/theme-core-colors';
import { ThemeCreator } from './theme/theme-creator';
import { ThemeNeutralColors } from './theme/theme-neutral-colors';
import { ThemeOptions } from './theme/theme-options';

@Injectable()
export class DefaultThemesCreator {
    private creator: ThemeCreator = new ThemeCreator('Digimezzo', 'info@digimezzo.com');

    public createAllThemes(): Theme[] {
        const themes: Theme[] = [];
        themes.push(this.createDopamineTheme());
        themes.push(this.createZuneTheme());
        themes.push(this.createBeatsTheme());
        themes.push(this.createNaughtyTheme());
        themes.push(this.createUbuntuTheme());
        themes.push(this.createManjaroTheme());
        themes.push(this.createPalenightTheme());

        return themes;
    }

    private createDopamineTheme(): Theme {
        const darkColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#5e5e5e',
            'rgba(255, 255, 255, 0.05)',
            'rgba(255, 255, 255, 0.1)',
            '',
            '#666',
            '#fff',
            '#1a1a1a',
            '#111',
            '#111',
            '#171717',
            '#fff',
            '#5e5e5e',
            '#272727',
            '#999',
            '#fff',
            '#5e5e5e',
            '#202020',
            'transparent',
            '#363636',
            '#363636',
            '#4883e0',
            '#202020',
            '#fff',
            '#5e5e5e',
            '#111'
        );

        const lightColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#838383',
            'rgba(0, 0, 0, 0.05)',
            'rgba(0, 0, 0, 0.1)',
            '',
            '#909090',
            '#000',
            '#f5f5f5',
            '#fdfdfd',
            '#fdfdfd',
            '#efefef',
            '#000',
            '#838383',
            '#dfdfdf',
            '#666',
            '#000',
            '#838383',
            '#cecece',
            'transparent',
            '#d7d7d7',
            '#d7d7d7',
            '#4883e0',
            '#dfdfdf',
            '#000',
            '#000',
            '#fdfdfd'
        );

        const options: ThemeOptions = new ThemeOptions(false);

        return new Theme('Dopamine', this.creator, new ThemeCoreColors('#6260e3', '#3fdcdd', '#4883e0'), darkColors, lightColors, options);
    }

    private createZuneTheme(): Theme {
        const darkColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#5e5e5e',
            'rgba(255, 255, 255, 0.05)',
            'rgba(255, 255, 255, 0.1)',
            '',
            '#666',
            '#fff',
            '#1a1a1a',
            '#111',
            '#111',
            '#171717',
            '#fff',
            '#5e5e5e',
            '#272727',
            '#999',
            '#fff',
            '#5e5e5e',
            '#202020',
            'transparent',
            '#363636',
            '#363636',
            '#f0266f',
            '#202020',
            '#fff',
            '#5e5e5e',
            '#111'
        );

        const lightColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#838383',
            'rgba(0, 0, 0, 0.05)',
            'rgba(0, 0, 0, 0.1)',
            '',
            '#909090',
            '#000',
            '#f5f5f5',
            '#fdfdfd',
            '#fdfdfd',
            '#efefef',
            '#000',
            '#838383',
            '#dfdfdf',
            '#666',
            '#000',
            '#838383',
            '#cecece',
            'transparent',
            '#d7d7d7',
            '#d7d7d7',
            '#f0266f',
            '#dfdfdf',
            '#000',
            '#000',
            '#fdfdfd'
        );

        const options: ThemeOptions = new ThemeOptions(false);

        return new Theme('Zune', this.creator, new ThemeCoreColors('#f78f1e', '#ed008c', '#f0266f'), darkColors, lightColors, options);
    }

    private createBeatsTheme(): Theme {
        const darkColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#5e5e5e',
            'rgba(255, 255, 255, 0.05)',
            'rgba(255, 255, 255, 0.1)',
            '',
            '#666',
            '#fff',
            '#1a1a1a',
            '#111',
            '#111',
            '#171717',
            '#fff',
            '#5e5e5e',
            '#272727',
            '#999',
            '#fff',
            '#5e5e5e',
            '#202020',
            'transparent',
            '#363636',
            '#363636',
            '#e21839',
            '#202020',
            '#fff',
            '#5e5e5e',
            '#111'
        );

        const lightColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#838383',
            'rgba(0, 0, 0, 0.05)',
            'rgba(0, 0, 0, 0.1)',
            '',
            '#909090',
            '#000',
            '#f5f5f5',
            '#fdfdfd',
            '#fdfdfd',
            '#efefef',
            '#000',
            '#838383',
            '#dfdfdf',
            '#666',
            '#000',
            '#838383',
            '#cecece',
            'transparent',
            '#d7d7d7',
            '#d7d7d7',
            '#e21839',
            '#dfdfdf',
            '#000',
            '#000',
            '#fdfdfd'
        );

        const options: ThemeOptions = new ThemeOptions(false);

        return new Theme('Beats', this.creator, new ThemeCoreColors('#98247f', '#e21839', '#e21839'), darkColors, lightColors, options);
    }

    private createNaughtyTheme(): Theme {
        const darkColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#5e5e5e',
            'rgba(255, 255, 255, 0.05)',
            'rgba(255, 255, 255, 0.1)',
            '',
            '#666',
            '#fff',
            '#1a1a1a',
            '#111',
            '#111',
            '#171717',
            '#fff',
            '#5e5e5e',
            '#272727',
            '#999',
            '#fff',
            '#5e5e5e',
            '#202020',
            'transparent',
            '#363636',
            '#363636',
            '#f5004a',
            '#202020',
            '#fff',
            '#5e5e5e',
            '#111'
        );

        const lightColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#838383',
            'rgba(0, 0, 0, 0.05)',
            'rgba(0, 0, 0, 0.1)',
            '',
            '#909090',
            '#000',
            '#f5f5f5',
            '#fdfdfd',
            '#fdfdfd',
            '#efefef',
            '#000',
            '#838383',
            '#dfdfdf',
            '#666',
            '#000',
            '#838383',
            '#cecece',
            'transparent',
            '#d7d7d7',
            '#d7d7d7',
            '#f5004a',
            '#dfdfdf',
            '#000',
            '#000',
            '#fdfdfd'
        );

        const options: ThemeOptions = new ThemeOptions(false);

        return new Theme('Naughty', this.creator, new ThemeCoreColors('#f5004a', '#9300ef', '#f5004a'), darkColors, lightColors, options);
    }

    private createUbuntuTheme(): Theme {
        const darkColors: ThemeNeutralColors = new ThemeNeutralColors(
            'white',
            'rgba(255, 255, 255, 0.05)',
            'rgba(255, 255, 255, 0.1)',
            '',
            '#7b7b7b',
            'white',
            '#2c2c2c',
            '#272727',
            '#272727',
            '#272727',
            'white',
            '#7b7b7b',
            '#373737',
            '#999',
            'white',
            '#5e5e5e',
            '#202020',
            '#151515',
            '#151515',
            '#151515',
            '#7d7d7d',
            '#373737',
            '#fff',
            '#fff',
            '#272727'
        );

        const lightColors: ThemeNeutralColors = new ThemeNeutralColors(
            'black',
            'rgba(0, 0, 0, 0.05)',
            'rgba(0, 0, 0, 0.1)',
            '',
            '#8c8c8c',
            'black',
            'white',
            '#fafafa',
            '#fafafa',
            '#fafafa',
            'black',
            '#8c8c8c',
            '#e9e9e9',
            '#666',
            'black',
            '#838383',
            '#cecece',
            '#dadada',
            '#dadada',
            '#dadada',
            '#b1b1b1',
            '#e9e9e9',
            'black',
            'black',
            '#fafafa'
        );

        const options: ThemeOptions = new ThemeOptions(true);

        return new Theme('Ubuntu', this.creator, new ThemeCoreColors('#d94612', '#f9622d', '#e95420'), darkColors, lightColors, options);
    }

    private createManjaroTheme(): Theme {
        const darkColors: ThemeNeutralColors = new ThemeNeutralColors(
            'white',
            'rgba(255, 255, 255, 0.05)',
            'rgba(255, 255, 255, 0.1)',
            '',
            '#818181',
            'white',
            '#2d2d2d',
            '#313131',
            '#313131',
            '#313131',
            'white',
            '#818181',
            '#373737',
            '#999',
            'white',
            '#5e5e5e',
            '#272727',
            '#1b1b1b',
            '#1b1b1b',
            '#1b1b1b',
            '#7a7a79',
            '#373737',
            '#fff',
            '#fff',
            '#313131'
        );

        const lightColors: ThemeNeutralColors = new ThemeNeutralColors(
            'black',
            'rgba(0, 0, 0, 0.05)',
            'rgba(0, 0, 0, 0.1)',
            '',
            '#838383',
            'black',
            'white',
            '#fafafa',
            '#fafafa',
            '#fafafa',
            'black',
            '#838383',
            '#e7e7e7',
            '#666',
            'black',
            '#838383',
            '#cecece',
            '#c7c7c7',
            '#c7c7c7',
            '#c7c7c7',
            '#abaeaf',
            '#e7e7e7',
            '#000',
            '#000',
            '#fafafa'
        );

        const options: ThemeOptions = new ThemeOptions(true);

        return new Theme('Manjaro', this.creator, new ThemeCoreColors('#009378', '#2eae92', '#16a085'), darkColors, lightColors, options);
    }

    private createPalenightTheme(): Theme {
        const darkColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#7b83a7',
            'rgba(255, 255, 255, 0.05)',
            '#00908c',
            '#fff',
            '#7b83a7',
            '#fbfdfd',
            '#2f3447',
            '#272b3b',
            '#272b3b',
            '#2b3042',
            '#fbfdfd',
            '#7b83a7',
            '#3a3f53',
            '#888',
            '#fff',
            '#7b83a7',
            '#212433',
            'transparent',
            '#282c3d',
            '#31364a',
            '#00908c',
            '#2f3447',
            '#fbfdfd',
            '#7b83a7',
            '#272b3b'
        );

        const lightColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#7b83a7',
            'rgba(255, 255, 255, 0.05)',
            '#00908c',
            '#fff',
            '#7b83a7',
            '#fbfdfd',
            '#2f3447',
            '#272b3b',
            '#272b3b',
            '#2b3042',
            '#fbfdfd',
            '#7b83a7',
            '#3a3f53',
            '#888',
            '#fff',
            '#7b83a7',
            '#212433',
            'transparent',
            '#282c3d',
            '#31364a',
            '#00908c',
            '#2f3447',
            '#fbfdfd',
            '#7b83a7',
            '#272b3b'
        );

        const options: ThemeOptions = new ThemeOptions(true);

        return new Theme('Palenight', this.creator, new ThemeCoreColors('#008884', '#56c6c1', '#00908c'), darkColors, lightColors, options);
    }
}
