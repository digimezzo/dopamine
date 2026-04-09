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
            '#2f2f34', // windowButtonIcon
            'rgba(46, 52, 54, 0.04)', // hoveredItemBackground
            'rgba(46, 52, 54, 0.13)', // selectedItemBackground
            '#949496', // tabText
            '#323237', // selectedTabText
            '#ffffff', // mainBackground
            '#ffffff', // headerBackground
            '#ffffff', // footerBackground
            '#ebebed', // sidePaneBackground
            '#323237', // primaryText
            '#949496', // secondaryText
            '#e0e0e1', // sliderBackground
            '#323237', // sliderThumbBackground
            '#e7e5e4', // albumCoverBackground
            '#dadadc', // headerSeparator
            '#dadadc', // paneSeparators
            '#e0e0e1', // settingsSeparators
            '#e0e0e1', // contextMenuSeparators
            '#3584e4', // scrollBars
            '#ebebeb', // searchBox
            '#2f2f34', // searchBoxText
            '#2f2f34', // searchBoxIcon
            '#fafafb', // dialogBackground
            '#ffffff', // primaryButtonText
            '#e6e6e7', // secondaryButtonBackground
            '#323237', // secondaryButtonText
            '#ffffff', // tooltipText
            '#dadadc', // buttonBorder
            '#ffffff', // highlightForeground
        );

        const options: ThemeOptions = new ThemeOptions(true);

        return new Theme('Adwaita', author, new ThemeCoreColors('#3584e4', '#5ca4ff', '#3584e4'), darkColors, lightColors, options);
    }
}
