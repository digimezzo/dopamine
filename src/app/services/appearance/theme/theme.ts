import { ThemeCoreColors } from './theme-core-colors';
import { ThemeAuthor } from './theme-author';
import { ThemeNeutralColors } from './theme-neutral-colors';
import { ThemeOptions } from './theme-options';

export class Theme {
    public constructor(
        public name: string,
        public author: ThemeAuthor,
        public coreColors: ThemeCoreColors,
        public darkColors: ThemeNeutralColors,
        public lightColors: ThemeNeutralColors,
        public options: ThemeOptions,
        public isBroken: boolean = false,
    ) {}
}
