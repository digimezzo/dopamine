import { ThemeCoreColors } from './theme-core-colors';
import { ThemeCreator } from './theme-creator';
import { ThemeNeutralColors } from './theme-neutral-colors';

export class Theme {
    constructor(
        public name: string,
        public creator: ThemeCreator,
        public coreColors: ThemeCoreColors,
        public darkColors: ThemeNeutralColors,
        public lightColors: ThemeNeutralColors
    ) {}
}
