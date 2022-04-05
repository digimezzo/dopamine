import { app, BrowserWindow, Menu, nativeTheme, protocol, screen, Tray } from 'electron';
import log from 'electron-log';
import * as Store from 'electron-store';
import * as windowStateKeeper from 'electron-window-state';
import * as os from 'os';
import * as path from 'path';
import * as url from 'url';

app.commandLine.appendSwitch('disable-color-correct-rendering');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

log.create('main');
log.transports.file.resolvePath = () => path.join(app.getPath('userData'), 'logs', 'Dopamine.log');

let win, serve;
const args = process.argv.slice(1);
serve = args.some((val) => val === '--serve');

// Workaround: Global does not allow setting custom properties.
// We need to cast it to "any" first.
const globalAny: any = global;

// Static folder is not detected correctly in production
if (process.env.NODE_ENV !== 'development') {
    globalAny.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

function windowHasFrame(): boolean {
    const settings: Store<any> = new Store();

    if (!settings.has('useSystemTitleBar')) {
        settings.set('useSystemTitleBar', false);
    }

    return settings.get('useSystemTitleBar');
}

function getTrayIcon(): string {
    if (nativeTheme.shouldUseDarkColors) {
        return path.join(globalAny.__static, os.platform() === 'win32' ? 'icons/white.ico' : 'icons/white.png');
    }

    return path.join(globalAny.__static, os.platform() === 'win32' ? 'icons/black.ico' : 'icons/black.png');
}

function createWindow(): void {
    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    Menu.setApplicationMenu(undefined);

    // Load the previous state with fallback to defaults
    const windowState = windowStateKeeper({
        defaultWidth: 870,
        defaultHeight: 620,
    });

    // Create the browser window.
    win = new BrowserWindow({
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
        backgroundColor: '#fff',
        frame: windowHasFrame(),
        icon: path.join(globalAny.__static, os.platform() === 'win32' ? 'icons/icon.ico' : 'icons/64x64.png'),
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        },
        show: false,
    });

    globalAny.windowHasFrame = windowHasFrame();

    windowState.manage(win);

    if (serve) {
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`),
        });
        win.loadURL('http://localhost:4200');
    } else {
        win.loadURL(
            url.format({
                pathname: path.join(__dirname, 'dist/index.html'),
                protocol: 'file:',
                slashes: true,
            })
        );
    }

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = undefined;
    });

    // 'ready-to-show' doesn't fire on Windows in dev mode. In prod it seems to work.
    // See: https://github.com/electron/electron/issues/7779
    win.on('ready-to-show', () => {
        win.show();
        win.focus();
    });

    // Makes links open in external browser
    const handleRedirect = (e: any, localUrl: string) => {
        // Check that the requested url is not the current page
        if (localUrl !== win.webContents.getURL()) {
            e.preventDefault();
            require('electron').shell.openExternal(localUrl);
        }
    };

    win.webContents.on('will-navigate', handleRedirect);
    win.webContents.on('new-window', handleRedirect);

    win.webContents.on('before-input-event', (event, input) => {
        if (input.key.toLowerCase() === 'f12') {
            // if (serve) {
            win.webContents.toggleDevTools();
            // }

            event.preventDefault();
        }
    });
}

try {
    log.info('[Main] [] +++ Starting +++');

    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
        log.info('[Main] [] There is already another instance running. Closing.');
        app.quit();
    } else {
        app.on('second-instance', (event, argv, workingDirectory) => {
            log.info('[Main] [] Attempt to run second instance. Showing current window.');
            win.webContents.send('arguments-received', argv);

            // Someone tried to run a second instance, we should focus our window.
            if (win) {
                if (win.isMinimized()) {
                    win.restore();
                }

                win.focus();
            }
        });

        // This method will be called when Electron has finished
        // initialization and is ready to create browser windows.
        // Some APIs can only be used after this event occurs.
        app.on('ready', createWindow);

        // Quit when all windows are closed.
        app.on('window-all-closed', () => {
            log.info('[App] [window-all-closed] +++ Stopping +++');
            // On OS X it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('activate', () => {
            // On OS X it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (win == undefined) {
                createWindow();
            }
        });

        let tray;

        app.whenReady().then(() => {
            // See: https://github.com/electron/electron/issues/23757
            protocol.registerFileProtocol('file', (request, callback) => {
                const pathname = decodeURI(request.url.replace('file:///', ''));
                callback(pathname);
            });

            tray = new Tray(getTrayIcon());
            const contextMenu = Menu.buildFromTemplate([
                {
                    label: 'Quit',
                    click(): void {
                        app.quit();
                    },
                },
            ]);
            tray.setToolTip('This is my application.');
            tray.setContextMenu(contextMenu);
        });

        nativeTheme.on('updated', () => tray.setImage(getTrayIcon()));
    }
} catch (e) {
    log.info(`[Main] [] Could not start. Error: ${e.message}`);
    throw e;
}
