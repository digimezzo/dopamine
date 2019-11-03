import { ColorTheme } from "../../core/colorTheme";
import { AppearanceServiceInterface } from "./appearanceServiceInterface";

export class AppearanceServiceStub implements AppearanceServiceInterface {

    public colorThemes: ColorTheme[] = [
        { name: "default-blue-theme", displayName: "Blue", color: "#1d7dd4" },
        { name: "default-green-theme", displayName: "Green", color: "#1db853" },
        { name: "default-yellow-theme", displayName: "Yellow", color: "#ff9626" },
        { name: "default-purple-theme", displayName: "Purple", color: "#7a4aba" },
        { name: "default-pink-theme", displayName: "Pink", color: "#ee205e" },
    ];

    public get useLightBackgroundTheme(): boolean {
        return false;
    }

    public set useLightBackgroundTheme(v: boolean) {
    }

    public get selectedColorTheme(): ColorTheme {
        return new ColorTheme("default-blue-theme", "Blue", "#1d7dd4");
    }

    public set selectedColorTheme(v: ColorTheme) {
    }

    public applyTheme(): void {
    }
}