/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { app, BrowserWindow, ipcMain, Menu, nativeTheme, protocol, Tray } from 'electron';
import log from 'electron-log';
import * as Store from 'electron-store';
import * as os from 'os';
import * as path from 'path';
import * as url from 'url';
import { Worker } from 'worker_threads';

/**
 * Command line parameters
 */
app.commandLine.appendSwitch('disable-color-correct-rendering'); // Prevents incorrect color rendering
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required'); // Prevents requiring user interaction to play audio
app.commandLine.appendSwitch('disable-http-cache'); // Disables clearing of the cache folder at each startup

/**
 * Logging
 */
log.create('main');
log.transports.file.resolvePath = () => path.join(app.getPath('userData'), 'logs', 'Dopamine.log');

/**
 * Variables
 */
const globalAny: any = global; // Global does not allow setting custom properties. We need to cast it to "any" first.
const settings: Store<any> = new Store();
const args: string[] = process.argv.slice(1);
const isServing: boolean = args.some((val) => val === '--serve');
let mainWindow: BrowserWindow | undefined;
let tray: Tray;
let isQuitting: boolean;

// Static folder is not detected correctly in production
if (process.env.NODE_ENV !== 'development') {
    globalAny.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

/**
 * Functions
 */
function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout | null;
    return function (...args: any[]) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}

function windowHasFrame(): boolean {
    if (!settings.has('useSystemTitleBar')) {
        settings.set('useSystemTitleBar', false);
    }

    return settings.get('useSystemTitleBar');
}

function shouldShowIconInNotificationArea(): boolean {
    if (!settings.has('showIconInNotificationArea')) {
        settings.set('showIconInNotificationArea', true);
    }

    return settings.get('showIconInNotificationArea');
}

function shouldMinimizeToNotificationArea(): boolean {
    if (!settings.has('minimizeToNotificationArea')) {
        settings.set('minimizeToNotificationArea', false);
    }

    return settings.get('minimizeToNotificationArea');
}

function shouldCloseToNotificationArea(): boolean {
    if (!settings.has('closeToNotificationArea')) {
        settings.set('closeToNotificationArea', false);
    }

    return settings.get('closeToNotificationArea');
}

function getTrayIcon(): string {
    if (os.platform() === 'darwin') {
        return path.join(globalAny.__static, 'icons/trayTemplate.png');
    }

    const invertColor: boolean = settings.get('invertNotificationAreaIconColor');

    if (os.platform() === 'win32') {
        if (!invertColor) {
            // Defaulting to black for Windows
            return path.join(globalAny.__static, 'icons/tray_black.ico');
        } else {
            return path.join(globalAny.__static, 'icons/tray_white.ico');
        }
    } else {
        if (!invertColor) {
            // Defaulting to white for Linux
            return path.join(globalAny.__static, 'icons/tray_white.png');
        } else {
            return path.join(globalAny.__static, 'icons/tray_black.png');
        }
    }
}

function setInitialWindowPositionAndSize(mainWindow: BrowserWindow): void {
    if (!settings.has('playerType')) {
        settings.set('playerType', 'full');
    }

    if (!settings.has('fullPlayerPositionAndSize')) {
        settings.set('fullPlayerPositionAndSize', '50;50;1000;650');
    }

    if (!settings.has('coverPlayerPosition')) {
        settings.set('coverPlayerPosition', '50;50');
    }

    let windowPositionAndSizeAsString: string = settings.get('fullPlayerPositionAndSize');
    if (settings.get('playerType') === 'cover') {
        windowPositionAndSizeAsString = `${settings.get('coverPlayerPosition')};350;420`;
    }

    const windowPositionAndSize: number[] = windowPositionAndSizeAsString.split(';').map(Number);
    mainWindow.setPosition(windowPositionAndSize[0], windowPositionAndSize[1]);
    mainWindow.setSize(windowPositionAndSize[2], windowPositionAndSize[3]);

    if (settings.get('playerType') !== 'full') {
        mainWindow.resizable = false;
        mainWindow.maximizable = false;
    }
}

function createMainWindow(): void {
    // Suppress the default menu
    Menu.setApplicationMenu(null);

    const remoteMain = require('@electron/remote/main');
    remoteMain.initialize();

    // Create the browser window
    mainWindow = new BrowserWindow({
        backgroundColor: '#fff',
        frame: windowHasFrame(),
        icon: path.join(globalAny.__static, os.platform() === 'win32' ? 'icons/icon.ico' : 'icons/64x64.png'),
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false,
        },
        show: false,
    });

    setInitialWindowPositionAndSize(mainWindow);

    remoteMain.enable(mainWindow.webContents);

    globalAny.windowHasFrame = windowHasFrame();

    if (isServing) {
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`),
        });
        mainWindow.loadURL('http://localhost:4200');
    } else {
        mainWindow.loadURL(
            url.format({
                pathname: path.join(__dirname, 'dist/index.html'),
                protocol: 'file:',
                slashes: true,
            }),
        );
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = undefined;
    });

    // 'ready-to-show' doesn't fire on Windows in dev mode. In prod it seems to work.
    // See: https://github.com/electron/electron/issues/7779
    mainWindow.on('ready-to-show', () => {
        if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
        }
    });

    // Makes links open in external browser
    const handleRedirect = (e: any, localUrl: string) => {
        // Check that the requested url is not the current page
        if (localUrl !== mainWindow?.webContents.getURL()) {
            e.preventDefault();
            require('electron').shell.openExternal(localUrl);
        }
    };

    mainWindow.webContents.on('will-navigate', handleRedirect);

    mainWindow.webContents.on('before-input-event', (event, input) => {
        if (input.key.toLowerCase() === 'f12') {
            if (mainWindow) {
                mainWindow.webContents.toggleDevTools();
            }

            event.preventDefault();
        }
    });

    mainWindow.on('minimize', (event: any) => {
        if (shouldMinimizeToNotificationArea()) {
            event.preventDefault();

            if (mainWindow) {
                mainWindow.hide();
            }
        }
    });

    mainWindow.on('close', (event: any) => {
        if (!isQuitting) {
            event.preventDefault();
            if (mainWindow) {
                if (shouldCloseToNotificationArea()) {
                    mainWindow.hide();
                } else {
                    mainWindow.webContents.send('application-close');
                }
            }
        }
    });

    mainWindow.on(
        'move',
        debounce(() => {
            if (mainWindow) {
                const position: number[] = mainWindow.getPosition();
                const size: number[] = mainWindow.getSize();

                if (settings.get('playerType') === 'full') {
                    settings.set('fullPlayerPositionAndSize', `${position[0]};${position[1]};${size[0]};${size[1]}`);
                } else if (settings.get('playerType') === 'cover') {
                    settings.set('coverPlayerPosition', `${position[0]};${position[1]};350;420`);
                }
            }
        }, 300),
    );

    mainWindow.on(
        'resize',
        debounce(() => {
            if (mainWindow) {
                const position: number[] = mainWindow.getPosition();
                const size: number[] = mainWindow.getSize();

                if (settings.get('playerType') === 'full') {
                    settings.set('fullPlayerPositionAndSize', `${position[0]};${position[1]};${size[0]};${size[1]}`);
                } else if (settings.get('playerType') === 'cover') {
                    settings.set('coverPlayerPosition', `${position[0]};${position[1]}`);
                }
            }
        }, 300),
    );
}

/**
 * Main
 */
try {
    log.info('[Main] [Main] +++ Starting +++');

    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
        log.info('[Main] [Main] There is already another instance running. Closing.');
        app.quit();
    } else {
        app.on('second-instance', (event, argv, workingDirectory) => {
            log.info('[Main] [Main] Attempt to run second instance. Showing existing window.');

            if (mainWindow) {
                mainWindow.webContents.send('arguments-received', argv);

                // Someone tried to run a second instance, we should focus the existing window.
                if (mainWindow.isMinimized()) {
                    mainWindow.restore();
                }

                mainWindow.focus();
            }
        });

        // This method will be called when Electron has finished
        // initialization and is ready to create browser windows.
        // Some APIs can only be used after this event occurs.
        app.on('ready', createMainWindow);

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
            if (mainWindow == undefined) {
                createMainWindow();
            }
        });

        app.on('before-quit', () => {
            isQuitting = true;
        });

        app.whenReady().then(() => {
            // See: https://github.com/electron/electron/issues/23757
            protocol.registerFileProtocol('file', (request, callback) => {
                const pathname = decodeURI(request.url.replace('file:///', ''));
                callback(pathname);
            });

            if (shouldShowIconInNotificationArea()) {
                tray = new Tray(getTrayIcon());
                tray.setToolTip('Dopamine');
            }
        });

        nativeTheme.on('updated', () => {
            if (tray == undefined) {
                return;
            }

            tray.setImage(getTrayIcon());
        });

        ipcMain.on('update-tray-context-menu', (event: any, arg: any) => {
            if (tray == undefined) {
                return;
            }

            const contextMenu = Menu.buildFromTemplate([
                {
                    label: arg.showDopamineLabel,
                    click(): void {
                        if (mainWindow) {
                            mainWindow.show();
                            mainWindow.focus();
                        }
                    },
                },
                {
                    label: arg.exitLabel,
                    click(): void {
                        if (process.platform !== 'darwin') {
                            app.quit();
                        }
                    },
                },
            ]);

            tray.setContextMenu(contextMenu);
        });

        ipcMain.on('update-tray-icon', (event: any, arg: any) => {
            if (tray == undefined) {
                return;
            }

            tray.setImage(getTrayIcon());
        });

        ipcMain.on('indexing-worker', (event: any, arg: any) => {
            const workerThread = new Worker(path.join(__dirname, 'main/workers/indexing-worker.js'), {
                workerData: { arg },
            });

            workerThread.on('message', (message): void => {
                if (mainWindow) {
                    mainWindow.webContents.send('indexing-worker-message', message);
                }
            });

            workerThread.on('exit', (): void => {
                if (mainWindow) {
                    mainWindow.webContents.send('indexing-worker-exit', 'Done');
                }
            });
        });

        ipcMain.on('closing-tasks-performed', (_) => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        ipcMain.on('set-full-player', (event: any, arg: any) => {
            if (mainWindow) {
                const fullPlayerPositionAndSizeAsString: string = settings.get('fullPlayerPositionAndSize');
                const fullPlayerPositionAndSize: number[] = fullPlayerPositionAndSizeAsString.split(';').map(Number);

                mainWindow.resizable = true;
                mainWindow.maximizable = true;
                mainWindow.setPosition(fullPlayerPositionAndSize[0], fullPlayerPositionAndSize[1]);
                mainWindow.setSize(fullPlayerPositionAndSize[2], fullPlayerPositionAndSize[3]);
            }
        });

        ipcMain.on('set-cover-player', (event: any, arg: any) => {
            if (mainWindow) {
                const coverPlayerPositionAsString: string = settings.get('coverPlayerPosition');
                const coverPlayerPosition: number[] = coverPlayerPositionAsString.split(';').map(Number);

                mainWindow.unmaximize();
                mainWindow.setPosition(coverPlayerPosition[0], coverPlayerPosition[1]);
                mainWindow.setSize(350, 420);
                mainWindow.resizable = false;
                mainWindow.maximizable = false;
            }
        });
    }
} catch (e) {
    log.error(`[Main] [Main] Could not start. Error: ${e.message}`);

    throw e;
}
