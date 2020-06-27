import { ColorScheme } from '../../core/color-scheme';

export abstract class AppearanceServiceBase {
    public abstract colorSchemes: ColorScheme[];
    public abstract useLightBackgroundTheme: boolean;
    public abstract selectedColorScheme: ColorScheme;
    public abstract applyTheme(): void;
    public abstract applyFontSize(): void;
}
