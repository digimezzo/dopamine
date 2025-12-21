const { getFullVersion } = require('./get-package-information.js');

const config = {
    appId: 'com.digimezzo.dopamine',
    productName: 'Dopamine',
    snap: {
        base: 'core22', // Must match build server (currently Ubuntu 22.04)
        grade: 'stable',
        confinement: 'strict',
        plugs: [
            // REQUIRED for Electron desktop apps
            'desktop',
            'desktop-legacy',
            'wayland',
            'x11',
            'unity7',
            'opengl',
            'audio-playback',
            'browser-support',
            'network',
            'network-bind',
            'gsettings',
            'screen-inhibit-control',

            // File access
            'home',
            'removable-media',
        ],
    },
    fileAssociations: [
        {
            name: 'MP3 Files',
            description: 'MP3 Files',
            ext: 'mp3',
            icon: 'build/mp3',
        },
        {
            name: 'FLAC Files',
            description: 'FLAC Files',
            ext: 'flac',
            icon: 'build/flac',
        },
        {
            name: 'OGG Files',
            description: 'OGG Files',
            ext: 'ogg',
            icon: 'build/ogg',
        },
        {
            name: 'M4A Files',
            description: 'M4A Files',
            ext: 'm4a',
            icon: 'build/m4a',
        },
        {
            name: 'OPUS Files',
            description: 'OPUS Files',
            ext: 'opus',
            icon: 'build/opus',
        },
        {
            name: 'WAV Files',
            description: 'WAV Files',
            ext: 'wav',
            icon: 'build/wav',
        },
    ],
    nsis: {
        shortcutName: 'Dopamine 3',
        perMachine: false,
        oneClick: false,
        deleteAppDataOnUninstall: false,
        allowToChangeInstallationDirectory: true,
        allowElevation: true,
        include: 'build/uninstaller.nsh',
        installerSidebar: 'build/Sidebar.bmp',
        uninstallerSidebar: 'build/Sidebar.bmp',
    },
    directories: {
        output: 'release',
    },
    files: ['**/*'],
    extraResources: ['LICENSE'],
    win: {
        target: ['nsis'],
        artifactName: `\${productName}-${getFullVersion()}.\${ext}`,
    },
    mac: {
        target: ['dmg'],
        artifactName: `\${productName}-${getFullVersion()}.\${ext}`,
    },
    linux: {
        target: ['AppImage', 'deb', 'rpm', 'pacman', 'snap'],
        category: 'Audio',
        artifactName: `\${productName}-${getFullVersion()}.\${ext}`,
        synopsis: 'The audio player that keeps it simple.',
        description:
            'Dopamine is an elegant audio player which tries to make organizing and listening to music as simple and pretty as possible.',
    },
};

module.exports = config;
