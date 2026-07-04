import { Theme } from '../theme/theme';
import { ThemeAuthor } from '../theme/theme-author';
import { ThemeCoreColors } from '../theme/theme-core-colors';
import { ThemeNeutralColors } from '../theme/theme-neutral-colors';
import { ThemeOptions } from '../theme/theme-options';

export class KadburyTheme {
    public static create(author: ThemeAuthor): Theme {
        const darkColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#9B78C2',
            'rgba(201, 168, 76, 0.08)',
            'rgba(201, 168, 76, 0.18)',
            '#9B78C2',
            '#E2C97E',
            '#3B0070',
            '#2E0058',
            '#2E0058',
            '#350064',
            '#FFFFFF',
            '#C8A8E8',
            '#5A1A9A',
            '#C9A84C',
            '#250048',
            'transparent',
            'transparent',
            '#4A1080',
            '#4A1080',
            '#C9A84C',
            '#3B0070',
            '#FFFFFF',
            '#9B78C2',
            '#2E0058',
            '#2E0058',
            '#5A1A9A',
            '#E2C97E',
            '#2E0058',
            '#5A1A9A',
            '#2E0058',
        );

        const lightColors: ThemeNeutralColors = new ThemeNeutralColors(
            '#6A2AA0',
            'rgba(74, 0, 130, 0.07)',
            'rgba(74, 0, 130, 0.15)',
            '#6A2AA0',
            '#3B0070',
            '#F5F0FA',
            '#FDFAFF',
            '#FDFAFF',
            '#EDE0F8',
            '#2E0058',
            '#6A2AA0',
            '#D4B8EE',
            '#C9A84C',
            '#E2CFF5',
            'transparent',
            'transparent',
            '#D4B8EE',
            '#D4B8EE',
            '#C9A84C',
            '#EDE0F8',
            '#2E0058',
            '#6A2AA0',
            '#FDFAFF',
            '#fff',
            '#D4B8EE',
            '#2E0058',
            '#fff',
            '#D4B8EE',
            '#fff',
        );

        const options: ThemeOptions = new ThemeOptions(true);

        return new Theme('Kadbury', author, new ThemeCoreColors('#C9A84C', '#E2C97E', '#C9A84C'), darkColors, lightColors, options);
    }
}
