import { ColorScheme } from '../../core/color-scheme';

export abstract class Appearance {
    public abstract colorSchemes: ColorScheme[];
    public abstract useLightBackgroundTheme: boolean;
    public abstract selectedColorScheme: ColorScheme;
    public abstract applyTheme(): void;
}
