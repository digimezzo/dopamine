import { Theme } from '../theme/theme';
import { ThemeAuthor } from '../theme/theme-author';
import { ThemeCoreColors } from '../theme/theme-core-colors';
import { ThemeNeutralColors } from '../theme/theme-neutral-colors';
import { ThemeOptions } from '../theme/theme-options';

export class AdwaitaTheme {
    public static create(author: ThemeAuthor): Theme {
        const darkColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#ffffff', // windowButtonIcon
            'rgba(255, 255, 255, 0.06)', // hoveredItemBackground
            'rgba(255, 255, 255, 0.12)', // selectedItemBackground
            '#c0bfbc', // tabText
            '#ffffff', // selectedTabText
            '#1e1e1e', // mainBackground
            '#303030', // headerBackground
            '#303030', // footerBackground
            '#242424', // sidePaneBackground
            '#ffffff', // primaryText
            '#c0bfbc', // secondaryText
            '#3d3d3d', // sliderBackground
            '#ffffff', // sliderThumbBackground
            '#2b2b2b', // albumCoverBackground
            'rgba(255, 255, 255, 0.08)', // headerSeparator
            'rgba(255, 255, 255, 0.08)', // paneSeparators
            '#454545', // settingsSeparators
            '#454545', // contextMenuSeparators
            '#3584e4', // scrollBars
            '#3a3a3a', // searchBox
            '#ffffff', // searchBoxText
            '#c0bfbc', // searchBoxIcon
            '#2f2f2f', // dialogBackground
            '#ffffff', // primaryButtonText
            '#4a4a4a', // secondaryButtonBackground
            '#ffffff', // secondaryButtonText
            '#ffffff', // tooltipText
            '#4a4a4a', // buttonBorder
            '#ffffff', // highlightForeground
        );

        const lightColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#2f2f34', // windowButtonIcon OK
            'rgba(46, 52, 54, 0.06)', // hoveredItemBackground
            'rgba(46, 52, 54, 0.12)', // selectedItemBackground
            '#5e5c64', // tabText
            '#1b1b1b', // selectedTabText
            '#ffffff', // mainBackground OK
            '#ffffff', // headerBackground OK
            '#ffffff', // footerBackground OK
            '#ebebed', // sidePaneBackground OK
            '#323237', // primaryText OK
            '#5e5c64', // secondaryText
            '#d8d7d3', // sliderBackground
            '#1b1b1b', // sliderThumbBackground
            '#e7e5e4', // albumCoverBackground
            '#dadadc', // headerSeparator OK
            '#dadadc', // paneSeparators OK
            '#d4d2cd', // settingsSeparators
            '#e0e0e1', // contextMenuSeparators OK
            '#3584e4', // scrollBars
            '#ebebeb', // searchBox OK
            '#2f2f34', // searchBoxText OK
            '#2f2f34', // searchBoxIcon OK
            '#ffffff', // dialogBackground
            '#ffffff', // primaryButtonText OK
            '#d4d2cd', // secondaryButtonBackground
            '#323237', // secondaryButtonText OK
            '#ffffff', // tooltipText OK
            '#d4d2cd', // buttonBorder
            '#ffffff', // highlightForeground
        );

        const options: ThemeOptions = new ThemeOptions(true);

        return new Theme('Adwaita', author, new ThemeCoreColors('#3584e4', '#5ca4ff', '#3584e4'), darkColors, lightColors, options);
    }
}
