import { Language } from "./language";
import { ColorTheme } from "./colorTheme";

export class Constants {
    static readonly applicationName: string = require("../../../package.json").name;
    static readonly applicationVersion: string = require("../../../package.json").version;
    static readonly applicationCopyright: string = "Copyright Digimezzo Ⓒ 2014 - 2019";
    static readonly donateUrl = "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=MQALEWTEZ7HX8";
    static readonly websiteUrl = "https://www.digimezzo.com";
    static readonly twitterUrl = "https://twitter.com/digimezzo";
    static readonly githubUrl = "https://github.com/digimezzo";

    static readonly colorThemeChangedEvent: string = "f132f4ce-ae3c-4e1d-958a-a9cd28517b68";
    static readonly backgroundThemeChangedEvent: string = "75035cf8-4300-465e-beb9-2f1cf107052f";

    static readonly languages: Language[] = [
        { code: "en", name: "English" },
        { code: "fr", name: "Français" }
    ];

    static readonly colorThemes: ColorTheme[] = [
        { name: "default-blue-theme", displayName: "Default blue", color: "#1D7DD4" },
        { name: "ubuntu-orange-theme", displayName: "Ubuntu orange", color: "#E95420" },
        { name: "linuxmint-green-theme", displayName: "Linux Mint green", color: "#8bb158" },
        { name: "manjaro-green-theme", displayName: "Manjaro green", color: "#16a085" },
        { name: "windows10-blue-theme", displayName: "Windows 10 blue", color: "#0078d7" },
        { name: "material-red-theme", displayName: "Material red", color: "#F44336" },
        { name: "material-pink-theme", displayName: "Material pink", color: "#E91E63" },
        { name: "material-purple-theme", displayName: "Material purple", color: "#9C27B0" },
        { name: "material-deep-purple-theme", displayName: "Material deep purple", color: "#673AB7" },
        { name: "material-indigo-theme", displayName: "Material indigo", color: "#3F51B5" },
        { name: "material-blue-theme", displayName: "Material blue", color: "#2196F3" },
        { name: "material-light-blue-theme", displayName: "Material light blue", color: "#03A9F4" },
        { name: "material-cyan-theme", displayName: "Material cyan", color: "#00BCD4" },
        { name: "material-teal-theme", displayName: "Material teal", color: "#009688" },
        { name: "material-green-theme", displayName: "Material green", color: "#4CAF50" },
        { name: "material-light-green-theme", displayName: "Material light green", color: "#8BC34A" },
        // { name: "material-lime-theme", displayName: "Material lime", color: "#CDDC39" },
        // { name: "material-yellow-theme", displayName: "Material yellow", color: "#FFEB3B" },
        { name: "material-amber-theme", displayName: "Material amber", color: "#FFC107" },
        { name: "material-orange-theme", displayName: "Material orange", color: "#FF9800" },
        { name: "material-deep-orange-theme", displayName: "Material deep orange", color: "#FF5722" }
    ];
}