import { Theme } from '../theme/theme';
import { ThemeAuthor } from '../theme/theme-author';
import { ThemeCoreColors } from '../theme/theme-core-colors';
import { ThemeNeutralColors } from '../theme/theme-neutral-colors';
import { ThemeOptions } from '../theme/theme-options';

export class AdwaitaTheme {
    public static create(author: ThemeAuthor): Theme {
        const darkColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#ffffff', // windowButtonIcon
            'rgba(255, 255, 255, 0.07)', // hoveredItemBackground
            'rgba(255, 255, 255, 0.10)', // selectedItemBackground
            '#99999b', // tabText
            '#ffffff', // selectedTabText
            '#222226', // mainBackground
            '#2e2e32', // headerBackground
            '#2e2e32', // footerBackground
            '#2e2e32', // sidePaneBackground
            '#ffffff', // primaryText
            '#99999b', // secondaryText
            '#4d4d51', // sliderBackground
            '#ffffff', // sliderThumbBackground
            '#38383b', // albumCoverBackground
            '#212125', // headerSeparator
            '#1d1d22', // paneSeparators
            '#333337', // settingsSeparators
            '#333337', // contextMenuSeparators
            '#3584e4', // scrollBars
            '#424246', // searchBox
            '#9c9c9e', // searchBoxText
            '#9c9c9e', // searchBoxIcon
            '#222226', // dialogBackground
            '#ffffff', // primaryButtonText
            '#4d4d51', // secondaryButtonBackground
            '#ffffff', // secondaryButtonText
            '#ffffff', // tooltipText
            '#4d4d51', // buttonBorder
            '#ffffff', // highlightForeground
        );

        const lightColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#2e2e33', // windowButtonIcon
            'rgba(46, 52, 54, 0.06)', // hoveredItemBackground
            'rgba(46, 52, 54, 0.10)', // selectedItemBackground
            '#979799', // tabText
            '#323237', // selectedTabText
            '#fafafb', // mainBackground
            '#ffffff', // headerBackground
            '#ffffff', // footerBackground
            '#ebebed', // sidePaneBackground
            '#323237', // primaryText
            '#979799', // secondaryText
            '#e0e0e1', // sliderBackground
            '#323237', // sliderThumbBackground
            '#ebebeb', // albumCoverBackground
            '#e2e2e3', // headerSeparator
            '#dadadc', // paneSeparators
            '#d2d2d4', // settingsSeparators
            '#d2d2d4', // contextMenuSeparators
            '#3584e4', // scrollBars
            '#e6e6e7', // searchBox
            '#818185', // searchBoxText
            '#868689', // searchBoxIcon
            '#fafafb', // dialogBackground
            '#ffffff', // primaryButtonText
            '#e0e0e1', // secondaryButtonBackground
            '#323237', // secondaryButtonText
            '#ffffff', // tooltipText
            '#e0e0e1', // buttonBorder
            '#ffffff', // highlightForeground
        );

        const options: ThemeOptions = new ThemeOptions(true);

        return new Theme('Adwaita', author, new ThemeCoreColors('#3584e4', '#5ca4ff', '#3584e4'), darkColors, lightColors, options);
    }
}
