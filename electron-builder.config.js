const { getFullVersion } = require('./get-package-information.js');

const config = {
    appId: 'com.digimezzo.dopamine',
    productName: 'Dopamine',
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
        desktop: {
            Name: 'Dopamine 3',
            Terminal: 'false',
        },
    },
};

module.exports = config;
