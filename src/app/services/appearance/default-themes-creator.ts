import { Injectable } from '@angular/core';
import { Theme } from './theme/theme';
import { ThemeCoreColors } from './theme/theme-core-colors';
import { ThemeCreator } from './theme/theme-creator';
import { ThemeNeutralColors } from './theme/theme-neutral-colors';
import { ThemeOptions } from './theme/theme-options';

@Injectable()
export class DefaultThemesCreator {
    private creator: ThemeCreator = new ThemeCreator('Digimezzo', 'digimezzo@outlook.com');

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
        const darkColors: ThemeNeutralColors = this.defaultDarkColors();
        const lightColors: ThemeNeutralColors = this.defaultLightColors();

        darkColors.scrollBars = '#4883e0';
        lightColors.scrollBars = '#4883e0';

        const options: ThemeOptions = new ThemeOptions(false);

        return new Theme('Dopamine', this.creator, new ThemeCoreColors('#6260e3', '#3fdcdd', '#4883e0'), darkColors, lightColors, options);
    }

    private createZuneTheme(): Theme {
        const darkColors: ThemeNeutralColors = this.defaultDarkColors();
        const lightColors: ThemeNeutralColors = this.defaultLightColors();

        darkColors.scrollBars = '#f0266f';
        lightColors.scrollBars = '#f0266f';

        const options: ThemeOptions = new ThemeOptions(false);

        return new Theme('Zune', this.creator, new ThemeCoreColors('#f78f1e', '#ed008c', '#f0266f'), darkColors, lightColors, options);
    }

    private createBeatsTheme(): Theme {
        const darkColors: ThemeNeutralColors = this.defaultDarkColors();
        const lightColors: ThemeNeutralColors = this.defaultLightColors();

        darkColors.scrollBars = '#e21839';
        lightColors.scrollBars = '#e21839';

        const options: ThemeOptions = new ThemeOptions(false);

        return new Theme('Beats', this.creator, new ThemeCoreColors('#98247f', '#e21839', '#e21839'), darkColors, lightColors, options);
    }

    private createNaughtyTheme(): Theme {
        const darkColors: ThemeNeutralColors = this.defaultDarkColors();
        const lightColors: ThemeNeutralColors = this.defaultLightColors();

        darkColors.scrollBars = '#f5004a';
        lightColors.scrollBars = '#f5004a';

        const options: ThemeOptions = new ThemeOptions(false);

        return new Theme('Naughty', this.creator, new ThemeCoreColors('#f5004a', '#9300ef', '#f5004a'), darkColors, lightColors, options);
    }

    private createUbuntuTheme(): Theme {
        const darkColors: ThemeNeutralColors = new ThemeNeutralColors(
            'white', // windowButtonIcon
            'rgba(255, 255, 255, 0.05)', // hoveredItemBackground
            'rgba(255, 255, 255, 0.1)', // selectedItemBackground
            '#7b7b7b', // tabText
            'white', // selectedTabText
            '#2c2c2c', // mainBackground
            '#272727', // headerBackground
            '#272727', // footerBackground
            '#272727', // sidePaneBackground
            'white', // primaryText
            '#7b7b7b', // secondaryText
            '#373737', // breadcrumbBackground
            '#999', // sliderBackground
            'white', // sliderThumbBackground
            '#5e5e5e', // albumCoverLogo
            '#202020', // albumCoverBackground
            '#151515', // paneSeparators
            '#151515', // settingsSeparators
            '#151515', // contextMenuSeparators
            '#7d7d7d', // scrollBars
            '#373737', // searchBox
            '#fff', // searchBoxText
            '#fff', // searchBoxIcon
            '#272727', // dialogBackground
            '#fff', // primaryButtonText
            '#595959', // secondaryButtonBackground
            '#fff', // secondaryButtonText
            '#fff', // tooltipText
        );

        const lightColors: ThemeNeutralColors = new ThemeNeutralColors(
            'black', // windowButtonIcon
            'rgba(0, 0, 0, 0.05)', // hoveredItemBackground
            'rgba(0, 0, 0, 0.1)', // selectedItemBackground
            '#8c8c8c', // tabText
            'black', // selectedTabText
            'white', // mainBackground
            '#fafafa', // headerBackground
            '#fafafa', // footerBackground
            '#fafafa', // sidePaneBackground
            'black', // primaryText
            '#8c8c8c', // secondaryText
            '#e9e9e9', // breadcrumbBackground
            '#666', // sliderBackground
            'black', // sliderThumbBackground
            '#838383', // albumCoverLogo
            '#cecece', // albumCoverBackground
            '#dadada', // paneSeparators
            '#dadada', // settingsSeparators
            '#dadada', // contextMenuSeparators
            '#b1b1b1', // scrollBars
            '#e9e9e9', // searchBox
            'black', // searchBoxText
            'black', // searchBoxIcon
            '#fafafa', // dialogBackground
            '#fff', // primaryButtonText
            '#e1e1e1', // secondaryButtonBackground
            '#000', // secondaryButtonText
            '#fff', // tooltipText
        );

        const options: ThemeOptions = new ThemeOptions(true);

        return new Theme('Ubuntu', this.creator, new ThemeCoreColors('#d94612', '#f9622d', '#e95420'), darkColors, lightColors, options);
    }

    private createManjaroTheme(): Theme {
        const darkColors: ThemeNeutralColors = new ThemeNeutralColors(
            'white', // windowButtonIcon
            'rgba(255, 255, 255, 0.05)', // hoveredItemBackground
            'rgba(255, 255, 255, 0.1)', // selectedItemBackground
            '#818181', // tabText
            'white', // selectedTabText
            '#2d2d2d', // mainBackground
            '#313131', // headerBackground
            '#313131', // footerBackground
            '#313131', // sidePaneBackground
            'white', // primaryText
            '#818181', // secondaryText
            '#373737', // breadcrumbBackground
            '#999', // sliderBackground
            'white', // sliderThumbBackground
            '#5e5e5e', // albumCoverLogo
            '#272727', // albumCoverBackground
            '#1b1b1b', // paneSeparators
            '#1b1b1b', // settingsSeparators
            '#1b1b1b', // contextMenuSeparators
            '#7a7a79', // scrollBars
            '#373737', // searchBox
            '#fff', // searchBoxText
            '#fff', // searchBoxIcon
            '#313131', // dialogBackground
            '#fff', // primaryButtonText
            '#595959', // secondaryButtonBackground
            '#fff', // secondaryButtonText
            '#fff', // tooltipText
        );

        const lightColors: ThemeNeutralColors = new ThemeNeutralColors(
            'black', // windowButtonIcon
            'rgba(0, 0, 0, 0.05)', // hoveredItemBackground
            'rgba(0, 0, 0, 0.1)', // selectedItemBackground
            '#838383', // tabText
            'black', // selectedTabText
            'white', // mainBackground
            '#fafafa', // headerBackground
            '#fafafa', // footerBackground
            '#fafafa', // sidePaneBackground
            'black', // primaryText
            '#838383', // secondaryText
            '#e7e7e7', // breadcrumbBackground
            '#666', // sliderBackground
            'black', // sliderThumbBackground
            '#838383', // albumCoverLogo
            '#cecece', // albumCoverBackground
            '#c7c7c7', // paneSeparators
            '#c7c7c7', // settingsSeparators
            '#c7c7c7', // contextMenuSeparators
            '#abaeaf', // scrollBars
            '#e7e7e7', // searchBox
            '#000', // searchBoxText
            '#000', // searchBoxIcon
            '#fafafa', // dialogBackground
            '#fff', // primaryButtonText
            '#e1e1e1', // secondaryButtonBackground
            '#000', // secondaryButtonText
            '#fff', // tooltipText
        );

        const options: ThemeOptions = new ThemeOptions(true);

        return new Theme('Manjaro', this.creator, new ThemeCoreColors('#009378', '#2eae92', '#16a085'), darkColors, lightColors, options);
    }

    private createPalenightTheme(): Theme {
        const darkColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#7b83a7', // windowButtonIcon
            'rgba(255, 255, 255, 0.05)', // hoveredItemBackground
            'rgba(255, 255, 255, 0.1)', // selectedItemBackground
            '#7b83a7', // tabText
            '#fbfdfd', // selectedTabText
            '#2f3447', // mainBackground
            '#272b3b', // headerBackground
            '#272b3b', // footerBackground
            '#2b3042', // sidePaneBackground
            '#fbfdfd', // primaryText
            '#7b83a7', // secondaryText
            '#3a3f53', // breadcrumbBackground
            '#888', // sliderBackground
            '#fff', // sliderThumbBackground
            '#7b83a7', // albumCoverLogo
            '#212433', // albumCoverBackground
            'transparent', // paneSeparators
            '#282c3d', // settingsSeparators
            '#31364a', // contextMenuSeparators
            '#00908c', // scrollBars
            '#2f3447', // searchBox
            '#fbfdfd', // searchBoxText
            '#7b83a7', // searchBoxIcon
            '#272b3b', // dialogBackground
            '#fff', // primaryButtonText
            '#3a3f53', // secondaryButtonBackground
            '#fff', // secondaryButtonText
            '#fff', // tooltipText
        );

        const lightColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#7b83a7', // windowButtonIcon
            'rgba(255, 255, 255, 0.05)', // hoveredItemBackground
            'rgba(0, 0, 0, 0.1)', // selectedItemBackground
            '#7b83a7', // tabText
            '#fbfdfd', // selectedTabText
            '#2f3447', // mainBackground
            '#272b3b', // headerBackground
            '#272b3b', // footerBackground
            '#2b3042', // sidePaneBackground
            '#fbfdfd', // primaryText
            '#7b83a7', // secondaryText
            '#3a3f53', // breadcrumbBackground
            '#888', // sliderBackground
            '#fff', // sliderThumbBackground
            '#7b83a7', // albumCoverLogo
            '#212433', // albumCoverBackground
            'transparent', // paneSeparators
            '#282c3d', // settingsSeparators
            '#31364a', // contextMenuSeparators
            '#00908c', // scrollBars
            '#2f3447', // searchBox
            '#fbfdfd', // searchBoxText
            '#7b83a7', // searchBoxIcon
            '#272b3b', // dialogBackground
            '#fff', // primaryButtonText
            '#3a3f53', // secondaryButtonBackground
            '#fff', // secondaryButtonText
            '#fff', // tooltipText
        );

        const options: ThemeOptions = new ThemeOptions(true);

        return new Theme('Palenight', this.creator, new ThemeCoreColors('#008884', '#56c6c1', '#00908c'), darkColors, lightColors, options);
    }

    private defaultDarkColors(): ThemeNeutralColors {
        return new ThemeNeutralColors(
            '#7e7e7e',
            'rgba(255, 255, 255, 0.05)',
            'rgba(255, 255, 255, 0.1)',
            '#666',
            '#fff',
            '#1a1a1a',
            '#111',
            '#111',
            '#171717',
            '#fff',
            '#7e7e7e',
            '#272727',
            '#999',
            '#fff',
            '#7e7e7e',
            '#202020',
            'transparent',
            '#363636',
            '#363636',
            '#4883e0',
            '#202020',
            '#fff',
            '#7e7e7e',
            '#111',
            '#fff',
            '#585858',
            '#fff',
            '#fff',
        );
    }

    private defaultLightColors(): ThemeNeutralColors {
        return new ThemeNeutralColors(
            '#838383',
            'rgba(0, 0, 0, 0.05)',
            'rgba(0, 0, 0, 0.1)',
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
            '#838383',
            '#fdfdfd',
            '#fff',
            '#e0e0e0',
            '#000',
            '#fff',
        );
    }
}
