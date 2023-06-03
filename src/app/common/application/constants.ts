import { ExternalComponent } from './external-component';
import { FontSize } from './font-size';
import { Language } from './language';

export class Constants {
    public static readonly logFileName: string = 'Dopamine.log';

    public static readonly languages: Language[] = [
        new Language('bg', 'Bulgarian', 'български', false),
        new Language('cs', 'Czech', 'Čeština', true),
        new Language('de', 'German', 'Deutsch', true),
        new Language('el', 'Greek', 'Ελληνικά', true),
        new Language('en', 'English', 'English', true),
        new Language('es', 'Spanish', 'Español', true),
        new Language('fr', 'French', 'Français', true),
        new Language('hr', 'Croatian', 'Hrvatski', true),
        new Language('nl', 'Dutch', 'Nederlands', true),
        new Language('pt-BR', 'Brazilian Portuguese', 'Português Brasileiro', true),
        new Language('ja-JP', 'Japanese', '日本語', false),
        new Language('ku', 'Kurdish', 'Kurdî', true),
        new Language('ru', 'Russian', 'русский', false),
        new Language('vi', 'Vietnamese', 'Tiếng Việt', true),
        new Language('zh-CN', 'Simplified Chinese', '简体中文', false),
        new Language('zh-TW', 'Traditional Chinese', '繁體中文', false),
    ];

    public static readonly previewApplicationTag: string = 'preview';
    public static readonly releaseCandidateApplicationTag: string = 'rc';
    public static readonly columnValueDelimiter: string = ';';

    public static readonly albumSizeInPixels: number = 120;
    public static readonly itemMarginInPixels: number = 8;
    public static readonly longListLoadDelayMilliseconds: number = 500;
    public static readonly shortListLoadDelayMilliseconds: number = 50;
    public static readonly albumsRedrawDelayMilliseconds: number = 150;
    public static readonly searchDelayMilliseconds: number = 500;
    public static readonly playlistSaveDelayMilliseconds: number = 3000;
    public static readonly semanticZoomInDelayMilliseconds: number = 100;
    public static readonly semanticZoomOutDelayMilliseconds: number = 100;

    public static readonly fontSizes: FontSize[] = [new FontSize(12), new FontSize(13), new FontSize(14), new FontSize(15)];

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

    public static artistsTabLabel: string = 'artists';
    public static genresTabLabel: string = 'genres';
    public static albumsTabLabel: string = 'albums';
    public static tracksTabLabel: string = 'tracks';
    public static playlistsTabLabel: string = 'playlists';
    public static foldersTabLabel: string = 'folders';

    // Transparent 1x1 Gif to avoid broken image icons.
    // See: https://stackoverflow.com/questions/22051573/how-to-hide-image-broken-icon-using-only-css-html/29111371
    public static emptyImage: string = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    public static readonly removablePrefixes: string[] = ['the', 'le', 'les', 'a', 'and'];

    public static readonly externalComponents: ExternalComponent[] = [
        new ExternalComponent(
            'Angular',
            'Angular is a development platform for building mobile and desktop web applications using Typescript/JavaScript and other languages.',
            'https://angular.io/',
            'https://github.com/angular/angular/blob/master/LICENSE'
        ),
        new ExternalComponent(
            'angular-split',
            'Angular UI library to split views and allow dragging to resize areas using CSS flexbox layout.',
            'https://angular-split.github.io/',
            'https://github.com/angular-split/angular-split/blob/main/LICENSE'
        ),
        new ExternalComponent(
            'better-sqlite3',
            'The fastest and simplest library for SQLite3 in Node.js.',
            'https://github.com/JoshuaWise/better-sqlite3',
            'https://github.com/JoshuaWise/better-sqlite3/blob/master/LICENSE'
        ),
        new ExternalComponent(
            'Discord.js RPC Extension',
            'A simple RPC client for Discord.',
            'https://github.com/discordjs/RPC',
            'https://github.com/discordjs/RPC/blob/master/LICENSE'
        ),
        new ExternalComponent(
            'electron-log',
            'Just a simple logging module for your Electron application.',
            'https://github.com/megahertz/electron-log',
            'https://github.com/megahertz/electron-log/blob/master/LICENSE'
        ),
        new ExternalComponent(
            'electron-store',
            'Simple data persistence for your Electron app or module - Save and load user preferences, app state, cache, etc.',
            'https://github.com/sindresorhus/electron-store',
            'https://github.com/sindresorhus/electron-store/blob/master/license'
        ),
        new ExternalComponent(
            'electron-window-state',
            'A library to store and restore window sizes and positions for your Electron app.',
            'https://github.com/mawie81/electron-window-state',
            'https://github.com/mawie81/electron-window-state/blob/master/license'
        ),
        new ExternalComponent(
            'fs-extra',
            `fs-extra adds file system methods that aren't included in the native fs module and adds promise support to the fs methods.`,
            'https://github.com/jprichardson/node-fs-extra',
            'https://github.com/jprichardson/node-fs-extra/blob/master/LICENSE'
        ),
        new ExternalComponent('Icons designed by Sharlee', 'Gorgeous Dopamine icons designed by Sharlee.', 'https://www.itssharl.ee/', ''),
        new ExternalComponent(
            'Icons8 Line Awesome',
            'Replace Font Awesome with modern line icons.',
            'https://github.com/icons8/line-awesome',
            'https://github.com/icons8/line-awesome/blob/master/LICENSE.md'
        ),
        new ExternalComponent(
            'Material Design Color Generator',
            'A tool for generating a color palette for Material Design. Supports exporting to and importing from various Material Design frameworks and toolkits.',
            'https://github.com/mbitson/mcg',
            'https://github.com/mbitson/mcg/blob/master/LICENSE'
        ),
        new ExternalComponent(
            'Md5 typescript',
            'Md5 typescript.',
            'https://github.com/Hipparch/Md5-typescript',
            'https://github.com/Hipparch/Md5-typescript/blob/master/LICENSE'
        ),
        new ExternalComponent(
            'Moment.js',
            'Parse, validate, manipulate, and display dates in javascript.',
            'https://momentjs.com/',
            'https://github.com/moment/moment/blob/develop/LICENSE'
        ),
        new ExternalComponent(
            'music-metadata',
            'Stream and file based music metadata parser for node. Supporting a wide range of audio and tag formats.',
            'https://github.com/borewit/music-metadata',
            'https://github.com/Borewit/music-metadata/blob/master/README.md'
        ),
        new ExternalComponent(
            'Node Fetch',
            'A light-weight module that brings Fetch API to Node.js.',
            'https://github.com/node-fetch/node-fetch',
            'https://github.com/node-fetch/node-fetch/blob/master/LICENSE.md'
        ),
        new ExternalComponent(
            'sanitize-filename',
            'Sanitize a string to be safe for use as a filename by removing directory paths and invalid characters.',
            'https://github.com/parshap/node-sanitize-filename',
            'https://github.com/parshap/node-sanitize-filename/blob/master/LICENSE.md'
        ),
        new ExternalComponent(
            'TagLib# for Node',
            'A node.js port of mono/taglib-sharp.',
            'https://github.com/benrr101/node-taglib-sharp',
            'https://github.com/benrr101/node-taglib-sharp/blob/develop/LICENSE'
        ),
        new ExternalComponent(
            'TinyColor',
            'TinyColor is a small, fast library for color manipulation and conversion in JavaScript. It allows many forms of input, while providing color conversions and other color utility functions. It has no dependencies.',
            'https://github.com/bgrins/TinyColor',
            'https://github.com/bgrins/TinyColor/blob/master/LICENSE'
        ),
        new ExternalComponent(
            'uuid',
            'Generate RFC-compliant UUIDs in JavaScript.',
            'https://github.com/uuidjs/uuid',
            'https://github.com/uuidjs/uuid/blob/master/LICENSE.md'
        ),
    ];
}
