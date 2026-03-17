import { Injectable } from '@angular/core';
import { Theme } from './theme/theme';
import { ThemeAuthor } from './theme/theme-author';
import { BeatsTheme } from './themes/beats-theme';
import { CatppuccinTheme } from './themes/catppuccin-theme';
import { DopamineTheme } from './themes/dopamine-theme';
import { DraculaTheme } from './themes/dracula-theme';
import { ManjaroTheme } from './themes/manjaro-theme';
import { NaughtyTheme } from './themes/naughty-theme';
import { PalenightTheme } from './themes/palenight-theme';
import { UbuntuTheme } from './themes/ubuntu-theme';
import { ZuneTheme } from './themes/zune-theme';

@Injectable()
export class DefaultThemesCreator {
    private author: ThemeAuthor = new ThemeAuthor('Digimezzo', 'digimezzo@outlook.com');
    private blackSpiritsAuthor: ThemeAuthor = new ThemeAuthor('BlackSpirits', 'blackspirits@gmail.com');

    public createAllThemes(): Theme[] {
        return [
            DopamineTheme.create(this.author),
            ZuneTheme.create(this.author),
            BeatsTheme.create(this.author),
            NaughtyTheme.create(this.author),
            UbuntuTheme.create(this.author),
            ManjaroTheme.create(this.author),
            PalenightTheme.create(this.author),
            CatppuccinTheme.create(this.blackSpiritsAuthor),
            DraculaTheme.create(this.blackSpiritsAuthor),
        ];
    }
}
