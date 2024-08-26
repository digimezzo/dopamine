"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const electron_1 = require("electron");
const electron_log_1 = require("electron-log");
const Store = require("electron-store");
const os = require("os");
const path = require("path");
const url = require("url");
const worker_threads_1 = require("worker_threads");
/**
 * Command line parameters
 */
electron_1.app.commandLine.appendSwitch('disable-color-correct-rendering'); // Prevents incorrect color rendering
electron_1.app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required'); // Prevents requiring user interaction to play audio
electron_1.app.commandLine.appendSwitch('disable-http-cache'); // Disables clearing of the cache folder at each startup
/**
 * Logging
 */
electron_log_1.default.create('main');
electron_log_1.default.transports.file.resolvePath = () => path.join(electron_1.app.getPath('userData'), 'logs', 'Dopamine.log');
/**
 * Variables
 */
const globalAny = global; // Global does not allow setting custom properties. We need to cast it to "any" first.
const settings = new Store();
const args = process.argv.slice(1);
const isServing = args.some((val) => val === '--serve');
let mainWindow;
let tray;
let isQuitting;
// Static folder is not detected correctly in production
if (process.env.NODE_ENV !== 'development') {
    globalAny.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}
/**
 * Functions
 */
function windowHasFrame() {
    if (!settings.has('useSystemTitleBar')) {
        settings.set('useSystemTitleBar', false);
    }
    return settings.get('useSystemTitleBar');
}
function shouldShowIconInNotificationArea() {
    if (!settings.has('showIconInNotificationArea')) {
        settings.set('showIconInNotificationArea', true);
    }
    return settings.get('showIconInNotificationArea');
}
function shouldMinimizeToNotificationArea() {
    if (!settings.has('minimizeToNotificationArea')) {
        settings.set('minimizeToNotificationArea', false);
    }
    return settings.get('minimizeToNotificationArea');
}
function shouldCloseToNotificationArea() {
    if (!settings.has('closeToNotificationArea')) {
        settings.set('closeToNotificationArea', false);
    }
    return settings.get('closeToNotificationArea');
}
function getTrayIcon() {
    if (os.platform() === 'darwin') {
        return path.join(globalAny.__static, 'icons/trayTemplate.png');
    }
    const invertColor = settings.get('invertNotificationAreaIconColor');
    if (os.platform() === 'win32') {
        if (!invertColor) {
            // Defaulting to black for Windows
            return path.join(globalAny.__static, 'icons/tray_black.ico');
        }
        else {
            return path.join(globalAny.__static, 'icons/tray_white.ico');
        }
    }
    else {
        if (!invertColor) {
            // Defaulting to white for Linux
            return path.join(globalAny.__static, 'icons/tray_white.png');
        }
        else {
            return path.join(globalAny.__static, 'icons/tray_black.png');
        }
    }
}
function createMainWindow() {
    // Suppress the default menu
    electron_1.Menu.setApplicationMenu(null);
    const remoteMain = require('@electron/remote/main');
    remoteMain.initialize();
    // Create the browser window
    let width = settings.get('fullPlayerWidth');
    let height = settings.get('fullPlayerHeight');
    let x = settings.get('fullPlayerX');
    let y = settings.get('fullPlayerY');
    if (settings.get('playerType') === 'cover') {
        width = settings.get('coverPlayerWidth');
        height = settings.get('coverPlayerHeight');
        x = settings.get('coverPlayerX');
        y = settings.get('coverPlayerY');
    }
    mainWindow = new electron_1.BrowserWindow({
        x: x,
        y: y,
        width: width,
        height: height,
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
    remoteMain.enable(mainWindow.webContents);
    globalAny.windowHasFrame = windowHasFrame();
    if (isServing) {
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`),
        });
        mainWindow.loadURL('http://localhost:4200');
    }
    else {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true,
        }));
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
    const handleRedirect = (e, localUrl) => {
        // Check that the requested url is not the current page
        if (localUrl !== (mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.getURL())) {
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
    mainWindow.on('minimize', (event) => {
        if (shouldMinimizeToNotificationArea()) {
            event.preventDefault();
            if (mainWindow) {
                mainWindow.hide();
            }
        }
    });
    mainWindow.on('close', (event) => {
        if (!isQuitting) {
            event.preventDefault();
            if (mainWindow) {
                if (shouldCloseToNotificationArea()) {
                    mainWindow.hide();
                }
                else {
                    mainWindow.webContents.send('application-close');
                }
            }
        }
    });
    mainWindow.on('resize', () => {
        if (mainWindow) {
            const size = mainWindow.getSize();
            const width = size[0];
            const height = size[1];
            const playerType = settings.get('playerType');
            if (playerType === 'full') {
                settings.set('fullPlayerWidth', width);
                settings.set('fullPlayerHeight', height);
            }
        }
    });
    mainWindow.on('move', () => {
        if (mainWindow) {
            const position = mainWindow.getPosition();
            const x = position[0];
            const y = position[1];
            const playerType = settings.get('playerType');
            if (playerType === 'full') {
                settings.set('fullPlayerX', x);
                settings.set('fullPlayerY', y);
            }
            else if (playerType === 'cover') {
                settings.set('coverPlayerX', x);
                settings.set('coverPlayerY', y);
            }
        }
    });
}
/**
 * Main
 */
try {
    electron_log_1.default.info('[Main] [Main] +++ Starting +++');
    const gotTheLock = electron_1.app.requestSingleInstanceLock();
    if (!gotTheLock) {
        electron_log_1.default.info('[Main] [Main] There is already another instance running. Closing.');
        electron_1.app.quit();
    }
    else {
        electron_1.app.on('second-instance', (event, argv, workingDirectory) => {
            electron_log_1.default.info('[Main] [Main] Attempt to run second instance. Showing existing window.');
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
        electron_1.app.on('ready', createMainWindow);
        // Quit when all windows are closed.
        electron_1.app.on('window-all-closed', () => {
            electron_log_1.default.info('[App] [window-all-closed] +++ Stopping +++');
            // On OS X it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform !== 'darwin') {
                electron_1.app.quit();
            }
        });
        electron_1.app.on('activate', () => {
            // On OS X it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (mainWindow == undefined) {
                createMainWindow();
            }
        });
        electron_1.app.on('before-quit', () => {
            isQuitting = true;
        });
        electron_1.app.whenReady().then(() => {
            // See: https://github.com/electron/electron/issues/23757
            electron_1.protocol.registerFileProtocol('file', (request, callback) => {
                const pathname = decodeURI(request.url.replace('file:///', ''));
                callback(pathname);
            });
            if (shouldShowIconInNotificationArea()) {
                tray = new electron_1.Tray(getTrayIcon());
                tray.setToolTip('Dopamine');
            }
        });
        electron_1.nativeTheme.on('updated', () => {
            if (tray == undefined) {
                return;
            }
            tray.setImage(getTrayIcon());
        });
        electron_1.ipcMain.on('update-tray-context-menu', (event, arg) => {
            if (tray == undefined) {
                return;
            }
            const contextMenu = electron_1.Menu.buildFromTemplate([
                {
                    label: arg.showDopamineLabel,
                    click() {
                        if (mainWindow) {
                            mainWindow.show();
                            mainWindow.focus();
                        }
                    },
                },
                {
                    label: arg.exitLabel,
                    click() {
                        if (process.platform !== 'darwin') {
                            electron_1.app.quit();
                        }
                    },
                },
            ]);
            tray.setContextMenu(contextMenu);
        });
        electron_1.ipcMain.on('update-tray-icon', (event, arg) => {
            if (tray == undefined) {
                return;
            }
            tray.setImage(getTrayIcon());
        });
        electron_1.ipcMain.on('indexing-worker', (event, arg) => {
            const workerThread = new worker_threads_1.Worker(path.join(__dirname, 'main/workers/indexing-worker.js'), {
                workerData: { arg },
            });
            workerThread.on('message', (message) => {
                if (mainWindow) {
                    mainWindow.webContents.send('indexing-worker-message', message);
                }
            });
            workerThread.on('exit', () => {
                if (mainWindow) {
                    mainWindow.webContents.send('indexing-worker-exit', 'Done');
                }
            });
        });
        electron_1.ipcMain.on('closing-tasks-performed', (_) => {
            if (process.platform !== 'darwin') {
                electron_1.app.quit();
            }
        });
        electron_1.ipcMain.on('set-full-player', (event, arg) => {
            if (mainWindow) {
                const width = settings.get('fullPlayerWidth');
                const height = settings.get('fullPlayerHeight');
                const x = settings.get('fullPlayerX');
                const y = settings.get('fullPlayerY');
                mainWindow.setSize(width, height);
                mainWindow.setPosition(x, y);
            }
        });
        electron_1.ipcMain.on('set-cover-player', (event, arg) => {
            if (mainWindow) {
                const width = settings.get('coverPlayerWidth');
                const height = settings.get('coverPlayerHeight');
                const x = settings.get('coverPlayerX');
                const y = settings.get('coverPlayerY');
                mainWindow.setSize(width, height);
                mainWindow.setPosition(x, y);
            }
        });
    }
}
catch (e) {
    electron_log_1.default.error(`[Main] [Main] Could not start. Error: ${e.message}`);
    throw e;
}
//# sourceMappingURL=main.js.map