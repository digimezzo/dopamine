import { ExternalComponent } from './external-component';
import { Language } from './language';

export class Constants {
    public static readonly logFileName: string = 'Dopamine.log';

    public static readonly languages: Language[] = [
        new Language('ar', 'Arabic', 'العربية', true),
        new Language('bg', 'Bulgarian', 'Български', true),
        new Language('cs', 'Czech', 'Čeština', false),
        new Language('de', 'German', 'Deutsch', false),
        new Language('el', 'Greek', 'Ελληνικά', true),
        new Language('en', 'English', 'English', false),
        new Language('es', 'Spanish', 'Español', false),
        new Language('fa', 'Farsi', 'فارسی', true),
        new Language('fr', 'French', 'Français', false),
        new Language('he', 'Hebrew', 'עברית', true),
        new Language('hr', 'Croatian', 'Hrvatski', false),
        new Language('it', 'Italian', 'Italiano', false),
        new Language('nl', 'Dutch', 'Nederlands', false),
        new Language('pl', 'Polish', 'Polski', false),
        new Language('pt-PT', 'Portuguese (Portugal)', 'Português (Portugal)', false),
        new Language('pt-BR', 'Portuguese (Brazil)', 'Português (Brasil)', false),
        new Language('ja-JP', 'Japanese', '日本語', true),
        new Language('ko', 'Korean', '한국어', true),
        new Language('ku', 'Kurdish', 'Kurdî', false),
        new Language('ru', 'Russian', 'Русский', true),
        new Language('sv', 'Swedish', 'Svenska', false),
        new Language('tr', 'Turkish', 'Türkçe', false),
        new Language('vi', 'Vietnamese', 'Tiếng Việt', false),
        new Language('zh-CN', 'Simplified Chinese', '简体中文', true),
        new Language('zh-TW', 'Traditional Chinese', '繁體中文', true),
    ];

    public static readonly previewApplicationTag: string = 'preview';
    public static readonly releaseCandidateApplicationTag: string = 'rc';
    public static readonly columnValueDelimiter: string = ';';

    public static readonly albumSizeInPixels: number = 124;
    public static readonly itemMarginInPixels: number = 8;
    public static readonly screenEaseMarginPixels: number = 50;
    public static readonly screenEaseSpeedMilliseconds: number = 350;
    public static readonly longListLoadDelayMilliseconds: number = 500;
    public static readonly shortListLoadDelayMilliseconds: number = 50;
    public static readonly albumsRedrawDelayMilliseconds: number = 150;
    public static readonly playlistsRedrawDelayMilliseconds: number = 150;
    public static readonly searchDelayMilliseconds: number = 500;
    public static readonly semanticZoomOutAnimationMilliseconds: number = 250;
    public static readonly semanticZoomInDelayMilliseconds: number = 100;
    public static readonly semanticZoomOutDelayMilliseconds: number = 100;
    public static readonly playbackInfoSwitchAnimationMilliseconds: number = 250;
    public static readonly playlistsSaveDelayMilliseconds: number = 1000;

    public static readonly fontSizes: number[] = [12, 13, 14, 15];

    public static readonly cachedCoverArtMaximumSize: number = 360;
    public static readonly cachedCoverArtJpegQuality: number = 80;

    public static readonly externalCoverArtPatterns: string[] = [
        'front.png',
        'front.jpg',
        'front.jpeg',
        'cover.png',
        'cover.jpg',
        'cover.jpeg',
        'folder.png',
        'folder.jpg',
        'folder.jpeg',
        'albumart.png',
        'albumart.jpg',
        'albumart.jpeg',
        '%filename%.png',
        '%filename%.jpg',
        '%filename%.jpeg',
    ];

    public static readonly alphabeticalHeaders: string[] = [
        '#',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
    ];

    // Transparent 1x1 Gif to avoid broken image icons.
    // See: https://stackoverflow.com/questions/22051573/how-to-hide-image-broken-icon-using-only-css-html/29111371
    public static emptyImage: string = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    public static readonly removablePrefixes: string[] = ['the', 'le', 'les', 'a', 'and'];

    public static readonly unknownArtist: string = 'unknown-artist';
    public static readonly unknownGenre: string = 'unknown-genre';
    public static readonly unknownTitle: string = 'unknown-title';

    public static readonly externalComponents: ExternalComponent[] = [
        new ExternalComponent(
            'Angular',
            'Angular is a development platform for building mobile and desktop web applications using Typescript/JavaScript and other languages.',
            'https://angular.io/',
            'https://github.com/angular/angular/blob/master/LICENSE',
        ),
        new ExternalComponent(
            'angular-split',
            'Angular UI library to split views and allow dragging to resize areas using CSS flexbox layout.',
            'https://angular-split.github.io/',
            'https://github.com/angular-split/angular-split/blob/main/LICENSE',
        ),
        new ExternalComponent(
            'better-sqlite3',
            'The fastest and simplest library for SQLite3 in Node.js.',
            'https://github.com/JoshuaWise/better-sqlite3',
            'https://github.com/JoshuaWise/better-sqlite3/blob/master/LICENSE',
        ),
        new ExternalComponent(
            'cheerio',
            'The fast, flexible, and elegant library for parsing and manipulating HTML and XML.',
            'https://github.com/cheeriojs/cheerio',
            'https://github.com/cheeriojs/cheerio/blob/main/LICENSE',
        ),
        new ExternalComponent(
            'Discord.js RPC Extension',
            'A simple RPC client for Discord.',
            'https://github.com/discordjs/RPC',
            'https://github.com/discordjs/RPC/blob/master/LICENSE',
        ),
        new ExternalComponent(
            'electron-log',
            'Just a simple logging module for your Electron application.',
            'https://github.com/megahertz/electron-log',
            'https://github.com/megahertz/electron-log/blob/master/LICENSE',
        ),
        new ExternalComponent(
            'electron-store',
            'Simple data persistence for your Electron app or module - Save and load user preferences, app state, cache, etc.',
            'https://github.com/sindresorhus/electron-store',
            'https://github.com/sindresorhus/electron-store/blob/master/license',
        ),
        new ExternalComponent(
            'fast-sort',
            'Blazing fast array sorting with TypeScript support.',
            'https://github.com/snovakovic/fast-sort',
            'https://github.com/snovakovic/fast-sort/blob/master/LICENSE',
        ),
        new ExternalComponent(
            'Fast HTML Parser',
            'A very fast HTML parser, generating a simplified DOM, with basic element query support. ',
            'https://github.com/taoqf/node-html-parser',
            'https://github.com/taoqf/node-html-parser/blob/main/LICENSE',
        ),
        new ExternalComponent(
            'fast-xml-parser',
            'Validate XML, Parse XML to JS Object, or Build XML from JS Object without C/C++ based libraries and no callback.',
            'https://github.com/NaturalIntelligence/fast-xml-parser',
            'https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/LICENSE',
        ),
        new ExternalComponent(
            'Font Awesome Free',
            "Font Awesome is the Internet's icon library and toolkit, used by millions of designers, developers, and content creators.",
            'https://github.com/FortAwesome/Font-Awesome',
            'https://github.com/FortAwesome/Font-Awesome/blob/6.x/LICENSE.txt',
        ),
        new ExternalComponent(
            'fs-extra',
            `fs-extra adds file system methods that aren't included in the native fs module and adds promise support to the fs methods.`,
            'https://github.com/jprichardson/node-fs-extra',
            'https://github.com/jprichardson/node-fs-extra/blob/master/LICENSE',
        ),
        new ExternalComponent('Icons designed by Sharlee', 'Gorgeous Dopamine icons designed by Sharlee.', 'https://www.itssharl.ee/', ''),
        new ExternalComponent(
            'Icons8 Line Awesome',
            'Replace Font Awesome with modern line icons.',
            'https://github.com/icons8/line-awesome',
            'https://github.com/icons8/line-awesome/blob/master/LICENSE.md',
        ),
        new ExternalComponent(
            'Jimp',
            'An image processing library written entirely in JavaScript for Node, with zero external or native dependencies.',
            'https://github.com/jimp-dev/jimp',
            'https://github.com/jimp-dev/jimp/blob/main/LICENSE',
        ),
        new ExternalComponent(
            'macOS icon created by VisualisationExpo',
            `Superb macOS icon created by VisualisationExpo, extending the original icon to better match the macOS look and feel.`,
            'https://github.com/VisualisationExpo',
            '',
        ),
        new ExternalComponent(
            'Material Design Color Generator',
            'A tool for generating a color palette for Material Design. Supports exporting to and importing from various Material Design frameworks and toolkits.',
            'https://github.com/mbitson/mcg',
            'https://github.com/mbitson/mcg/blob/master/LICENSE',
        ),
        new ExternalComponent(
            'Md5 typescript',
            'Md5 typescript.',
            'https://github.com/Hipparch/Md5-typescript',
            'https://github.com/Hipparch/Md5-typescript/blob/master/LICENSE',
        ),
        new ExternalComponent(
            'Moment.js',
            'Parse, validate, manipulate, and display dates in javascript.',
            'https://momentjs.com/',
            'https://github.com/moment/moment/blob/develop/LICENSE',
        ),
        new ExternalComponent(
            'Node Fetch',
            'A light-weight module that brings Fetch API to Node.js.',
            'https://github.com/node-fetch/node-fetch',
            'https://github.com/node-fetch/node-fetch/blob/master/LICENSE.md',
        ),
        new ExternalComponent(
            'sanitize-filename',
            'Sanitize a string to be safe for use as a filename by removing directory paths and invalid characters.',
            'https://github.com/parshap/node-sanitize-filename',
            'https://github.com/parshap/node-sanitize-filename/blob/master/LICENSE.md',
        ),
        new ExternalComponent(
            'TagLib# for Node',
            'A node.js port of mono/taglib-sharp.',
            'https://github.com/benrr101/node-taglib-sharp',
            'https://github.com/benrr101/node-taglib-sharp/blob/develop/LICENSE',
        ),
        new ExternalComponent(
            'TinyColor',
            'TinyColor is a small, fast library for color manipulation and conversion in JavaScript. It allows many forms of input, while providing color conversions and other color utility functions. It has no dependencies.',
            'https://github.com/bgrins/TinyColor',
            'https://github.com/bgrins/TinyColor/blob/master/LICENSE',
        ),
        new ExternalComponent(
            'uuid',
            'Generate RFC-compliant UUIDs in JavaScript.',
            'https://github.com/uuidjs/uuid',
            'https://github.com/uuidjs/uuid/blob/master/LICENSE.md',
        ),
    ];
}
