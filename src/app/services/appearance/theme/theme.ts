import { ThemeCoreColors } from './theme-core-colors';
import { ThemeCreator } from './theme-creator';
import { ThemeNeutralColors } from './theme-neutral-colors';
import { ThemeOptions } from './theme-options';

export class Theme {
    constructor(
        public name: string,
        public creator: ThemeCreator,
        public coreColors: ThemeCoreColors,
        public darkColors: ThemeNeutralColors,
        public lightColors: ThemeNeutralColors,
        public options: ThemeOptions,
        public isBroken: boolean = false
    ) {}
}
