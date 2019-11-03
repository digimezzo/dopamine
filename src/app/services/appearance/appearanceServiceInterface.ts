import { ColorTheme } from "../../core/colorTheme";

export interface AppearanceServiceInterface {
    colorThemes: ColorTheme[];
    useLightBackgroundTheme: boolean;
    selectedColorTheme: ColorTheme;
    applyTheme(): void;
}