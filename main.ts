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
let isQuit: boolean;
let fileProcessingTimeout: NodeJS.Timeout;

// Static folder is not detected correctly in production
if (process.env.NODE_ENV !== 'development') {
    globalAny.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

// Static variables
globalAny.windowHasFrame = windowHasFrame();
globalAny.isMacOS = isMacOS();
globalAny.fileQueue = [];

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

function isMacOS(): boolean {
    return process.platform === 'darwin';
}

function isWindows(): boolean {
    return process.platform === 'win32';
}

function titleBarStyle(): 'hiddenInset' | 'default' {
    if (settings.get('useSystemTitleBar')) {
        return 'default';
    }
    // makes traffic lights visible on macOS
    if (isMacOS()) {
        return 'hiddenInset';
    }
    return 'default';
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
    if (isMacOS()) {
        return path.join(globalAny.__static, 'icons/trayTemplate.png');
    }

    const invertColor: boolean = settings.get('invertNotificationAreaIconColor');

    if (isWindows()) {
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

function setInitialWindowState(mainWindow: BrowserWindow): void {
    try {
        if (!settings.has('playerType')) {
            settings.set('playerType', 'full');
        }

        if (!settings.has('fullPlayerPositionSizeMaximized')) {
            settings.set('fullPlayerPositionSizeMaximized', '50;50;1000;650;0');
        }

        if (!settings.has('coverPlayerPosition')) {
            settings.set('coverPlayerPosition', '50;50');
        }

        let windowPositionSizeMaximizedAsString: string = settings.get('fullPlayerPositionSizeMaximized');

        if (settings.get('playerType') === 'cover') {
            windowPositionSizeMaximizedAsString = `${settings.get('coverPlayerPosition')};350;430;0`;
        }

        const windowPositionSizeMaximized: number[] = windowPositionSizeMaximizedAsString.split(';').map(Number);
        mainWindow.setPosition(windowPositionSizeMaximized[0], windowPositionSizeMaximized[1]);

        if (settings.get('playerType') !== 'full') {
            mainWindow.resizable = false;
            mainWindow.maximizable = false;
            mainWindow.setContentSize(windowPositionSizeMaximized[2], windowPositionSizeMaximized[3]);
            if (isMacOS()) {
                mainWindow.fullScreenable = false;
            }
        } else {
            if (isMacOS()) {
                mainWindow.fullScreenable = true;
            }
            mainWindow.setSize(windowPositionSizeMaximized[2], windowPositionSizeMaximized[3]);
            if (windowPositionSizeMaximized[4] === 1) {
                mainWindow.maximize();
            }
        }
    } catch (e) {
        log.error(`[Main] [setInitialWindowState] Could not set initial window state. Error: ${e.message}`);

        settings.set('playerType', 'full');
        settings.set('fullPlayerPositionSizeMaximized', '50;50;1000;650;0');
        settings.set('coverPlayerPosition', '50;50');
        let windowPositionSizeMaximizedAsString: string = settings.get('fullPlayerPositionSizeMaximized');
        const windowPositionSizeMaximized: number[] = windowPositionSizeMaximizedAsString.split(';').map(Number);
        mainWindow.setPosition(windowPositionSizeMaximized[0], windowPositionSizeMaximized[1]);
        mainWindow.setSize(windowPositionSizeMaximized[2], windowPositionSizeMaximized[3]);
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
        titleBarStyle: titleBarStyle(),
        trafficLightPosition: isMacOS() ? { x: 10, y: 15 } : undefined,
        icon: path.join(globalAny.__static, isWindows() ? 'icons/icon.ico' : 'icons/64x64.png'),
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false,
        },
        show: false,
    });

    setInitialWindowState(mainWindow);

    remoteMain.enable(mainWindow.webContents);

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
                if (isQuit) {
                    mainWindow.webContents.send('application-close');
                    isQuitting = true;
                }
                // on MacOS, close button never closed entire app
                else if (isMacOS()) {
                    mainWindow.hide();
                } else if (shouldCloseToNotificationArea()) {
                    mainWindow.hide();
                } else {
                    mainWindow.webContents.send('application-close');
                    isQuitting = true;
                }
            }
        }
    });

    mainWindow.on(
        'move',
        debounce(() => {
            if (mainWindow && !mainWindow.isMaximized()) {
                const position: number[] = mainWindow.getPosition();
                const size: number[] = mainWindow.getSize();

                if (settings.get('playerType') === 'full') {
                    const isMaximized: number = mainWindow.isMaximized() ? 1 : 0;
                    settings.set('fullPlayerPositionSizeMaximized', `${position[0]};${position[1]};${size[0]};${size[1]};${isMaximized}`);
                } else if (settings.get('playerType') === 'cover') {
                    settings.set('coverPlayerPosition', `${position[0]};${position[1]};350;430`);
                }
            }
        }, 300),
    );

    mainWindow.on(
        'resize',
        debounce(() => {
            if (mainWindow && !mainWindow.isMaximized()) {
                const position: number[] = mainWindow.getPosition();
                const size: number[] = mainWindow.getSize();

                if (settings.get('playerType') === 'full') {
                    const isMaximized: number = mainWindow.isMaximized() ? 1 : 0;
                    settings.set('fullPlayerPositionSizeMaximized', `${position[0]};${position[1]};${size[0]};${size[1]};${isMaximized}`);
                } else if (settings.get('playerType') === 'cover') {
                    settings.set('coverPlayerPosition', `${position[0]};${position[1]}`);
                }
            }
        }, 300),
    );

    mainWindow.on('maximize', (event: any) => {
        if (mainWindow) {
            if (settings.get('playerType') === 'full') {
                let windowPositionSizeMaximizedAsString: string = settings.get('fullPlayerPositionSizeMaximized');
                const windowPositionSizeMaximized: number[] = windowPositionSizeMaximizedAsString.split(';').map(Number);
                console.log(windowPositionSizeMaximized);
                settings.set(
                    'fullPlayerPositionSizeMaximized',
                    `${windowPositionSizeMaximized[0]};${windowPositionSizeMaximized[1]};${windowPositionSizeMaximized[2]};${windowPositionSizeMaximized[3]};1`,
                );
            }
        }
    });

    mainWindow.on('unmaximize', (event: any) => {
        if (mainWindow) {
            if (settings.get('playerType') === 'full') {
                settings.set(
                    'fullPlayerPositionSizeMaximized',
                    `${mainWindow.getPosition().join(';')};${mainWindow.getSize().join(';')};0`,
                );
            }
        }
    });

    mainWindow.on('leave-full-screen', () => {
        if (!mainWindow) {
            return;
        }
        // On macOS, fullscreen transitions takes time
        // So, we need to wait for the leave-full-screen to finally resize the window
        if (!isMacOS()) {
            return;
        }

        // if mode is not cover anymore, return
        if (settings.get('playerType') !== 'cover') {
            return;
        }

        setCoverPlayer(mainWindow);
    });
}

function setCoverPlayer(mainWindow: BrowserWindow): void {
    const coverPlayerPositionAsString: string = settings.get('coverPlayerPosition');
    const coverPlayerPosition: number[] = coverPlayerPositionAsString.split(';').map(Number);

    if (isMacOS()) {
        mainWindow.fullScreenable = false;
    }
    mainWindow.resizable = false;
    mainWindow.maximizable = false;
    mainWindow.setPosition(coverPlayerPosition[0], coverPlayerPosition[1]);
    mainWindow.setContentSize(350, 430);
}

function pushFilesToQueue(files: string[], functionName: string): void {
    globalAny.fileQueue.push(...files);
    log.info(`[App] [${functionName}] File queue: ${globalAny.fileQueue}`);
    clearTimeout(fileProcessingTimeout);
    fileProcessingTimeout = setTimeout(processFileQueue, debounceDelay);
}

function processFileQueue(): void {
    if (globalAny.fileQueue.length > 0) {
        log.info(`[App] [processFileQueue] Processing files: ${globalAny.fileQueue}`);
        if (mainWindow) {
            mainWindow.webContents.send('arguments-received', globalAny.fileQueue);
        }
    }
}

const debounceDelay: number = 100;

/**
 * Main
 */
try {
    log.info('[Main] [Main] +++ Starting +++');

    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
        log.info('[Main] [Main] There is already another instance running. Closing.');
        // Quit second instance
        app.quit();
    } else {
        app.on('second-instance', (event, argv, workingDirectory) => {
            // First instance gets the arguments of the second instance and processes them
            log.info('[App] [second-instance] Attempt to run second instance. Showing existing window.');
            pushFilesToQueue(argv, 'second-instance');

            if (mainWindow) {
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
            if (!isMacOS()) {
                app.quit();
            }
        });

        app.on('activate', () => {
            // On macOS, it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (mainWindow == undefined) {
                createMainWindow();
            }

            // On macOS, clicking the dock icon should show the window.
            if (isMacOS()) {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                }
            }
        });

        app.on('before-quit', () => {
            isQuit = true;
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

        app.on('open-file', (event, path) => {
            log.info(`[App] [open-file] File opened: ${path}`);
            // On macOS, the path of a double-clicked file is not passed as argument. Instead, it is passed as open-file event.
            // https://stackoverflow.com/questions/50935292/argv1-returns-unexpected-value-when-i-open-a-file-on-double-click-in-electron
            event.preventDefault();
            pushFilesToQueue([path], 'open-file');
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
                        app.quit();
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
            app.quit();
        });

        ipcMain.on('set-full-player', (event: any, arg: any) => {
            log.info('[Main] [set-full-player] Setting playerType to full player');
            if (mainWindow) {
                const fullPlayerPositionSizeMaximizedAsString: string = settings.get('fullPlayerPositionSizeMaximized');
                console.log(fullPlayerPositionSizeMaximizedAsString);
                const fullPlayerPositionSizeMaximized: number[] = fullPlayerPositionSizeMaximizedAsString.split(';').map(Number);

                if (isMacOS()) {
                    mainWindow.fullScreenable = true;
                }
                mainWindow.resizable = true;
                mainWindow.maximizable = true;
                mainWindow.setPosition(fullPlayerPositionSizeMaximized[0], fullPlayerPositionSizeMaximized[1]);
                mainWindow.setSize(fullPlayerPositionSizeMaximized[2], fullPlayerPositionSizeMaximized[3]);

                if (fullPlayerPositionSizeMaximized[4] === 1) {
                    mainWindow.maximize();
                }
            }
        });

        ipcMain.on('set-cover-player', (event: any, arg: any) => {
            log.info('[Main] [set-cover-player] Setting playerType to cover player');
            if (mainWindow) {
                // We cannot resize the window when it is still in full screen mode on macOS.
                if (isMacOS() && mainWindow.isFullScreen()) {
                    // If for whatever reason fullScreenable will be set to false
                    // mainWindow.fullScreen = false; will not work on macOS.
                    mainWindow.fullScreenable = true;
                    mainWindow.fullScreen = false;
                    return;
                }

                mainWindow.unmaximize();
                setCoverPlayer(mainWindow);
            }
        });

        ipcMain.on('clear-file-queue', (event: any, arg: any) => {
            log.info('[Main] [clear-file-queue] Clearing file queue');
            globalAny.fileQueue = [];
        });
    }
} catch (e) {
    log.error(`[Main] [Main] Could not start. Error: ${e.message}`);

    throw e;
}
