import { ExternalComponent } from './external-component';
import { FontSize } from './font-size';
import { Language } from './language';

export class Constants {
    public static readonly languages: Language[] = [
        new Language('en', 'English'),
        new Language('fr', 'Français'),
        new Language('nl', 'Nederlands')
    ];

    public static readonly fontSizes: FontSize[] = [
        new FontSize(13),
        new FontSize(14),
        new FontSize(15)
    ];

    public static readonly externalComponents: ExternalComponent[] = [
        new ExternalComponent(
            'Angular',
            'Angular is a development platform for building mobile and desktop web applications using Typescript/JavaScript and other languages.',
            'https://angular.io/',
            'https://github.com/angular/angular/blob/master/LICENSE'
        ),
        new ExternalComponent(
            'better-sqlite3',
            'The fastest and simplest library for SQLite3 in Node.js.',
            'https://github.com/JoshuaWise/better-sqlite3',
            'https://github.com/JoshuaWise/better-sqlite3/blob/master/LICENSE'
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
        new ExternalComponent(
            'howler.js',
            'Javascript audio library for the modern web.',
            'https://howlerjs.com/',
            'https://github.com/goldfire/howler.js/blob/master/LICENSE.md'
        ),
        new ExternalComponent(
            'Icons designed by Sharlee',
            'Gorgeous Dopamine icons designed by Sharlee.',
            'https://www.itssharl.ee/',
            ''
        ),
        new ExternalComponent(
            'Icons8 Line Awesome',
            'Replace Font Awesome with modern line icons.',
            'https://github.com/icons8/line-awesome',
            'https://github.com/icons8/line-awesome/blob/master/LICENSE.md'
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
            'sharp',
            'High performance Node.js image processing, the fastest module to resize JPEG, PNG, WebP and TIFF images. Uses the libvips library.',
            'https://github.com/lovell/sharp',
            'https://github.com/lovell/sharp/blob/master/LICENSE'
        ),
        new ExternalComponent(
            'uuid',
            'Generate RFC-compliant UUIDs in JavaScript.',
            'https://github.com/uuidjs/uuid',
            'https://github.com/uuidjs/uuid/blob/master/LICENSE.md'
        )
    ];
}
