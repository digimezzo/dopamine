"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_log_1 = require("electron-log");
const Store = require("electron-store");
const windowStateKeeper = require("electron-window-state");
const os = require("os");
const path = require("path");
const url = require("url");
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
    if (electron_1.nativeTheme.shouldUseDarkColors) {
        if (invertColor) {
            return path.join(globalAny.__static, os.platform() === 'win32' ? 'icons/tray_black.ico' : 'icons/tray_black.png');
        }
        else {
            return path.join(globalAny.__static, os.platform() === 'win32' ? 'icons/tray_white.ico' : 'icons/tray_white.png');
        }
    }
    if (invertColor) {
        return path.join(globalAny.__static, os.platform() === 'win32' ? 'icons/tray_white.ico' : 'icons/tray_white.png');
    }
    else {
        return path.join(globalAny.__static, os.platform() === 'win32' ? 'icons/tray_black.ico' : 'icons/tray_black.png');
    }
}
function createMainWindow() {
    // Suppress the default menu
    electron_1.Menu.setApplicationMenu(undefined);
    // Load the previous state with fallback to defaults
    const windowState = windowStateKeeper({
        defaultWidth: 870,
        defaultHeight: 620,
    });
    const remoteMain = require('@electron/remote/main');
    remoteMain.initialize();
    // Create the browser window
    mainWindow = new electron_1.BrowserWindow({
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
            contextIsolation: false,
        },
        show: false,
    });
    remoteMain.enable(mainWindow.webContents);
    globalAny.windowHasFrame = windowHasFrame();
    windowState.manage(mainWindow);
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
        mainWindow.show();
        mainWindow.focus();
    });
    // Makes links open in external browser
    const handleRedirect = (e, localUrl) => {
        // Check that the requested url is not the current page
        if (localUrl !== mainWindow.webContents.getURL()) {
            e.preventDefault();
            require('electron').shell.openExternal(localUrl);
        }
    };
    mainWindow.webContents.on('will-navigate', handleRedirect);
    mainWindow.webContents.on('new-window', handleRedirect);
    mainWindow.webContents.on('before-input-event', (event, input) => {
        if (input.key.toLowerCase() === 'f12') {
            // if (serve) {
            mainWindow.webContents.toggleDevTools();
            // }
            event.preventDefault();
        }
    });
    mainWindow.on('minimize', (event) => {
        if (shouldMinimizeToNotificationArea()) {
            event.preventDefault();
            mainWindow.hide();
        }
    });
    mainWindow.on('close', (event) => {
        if (shouldCloseToNotificationArea()) {
            if (!isQuitting) {
                event.preventDefault();
                mainWindow.hide();
            }
            return false;
        }
    });
}
/**
 * Main
 */
try {
    electron_log_1.default.info('[Main] [] +++ Starting +++');
    const gotTheLock = electron_1.app.requestSingleInstanceLock();
    if (!gotTheLock) {
        electron_log_1.default.info('[Main] [] There is already another instance running. Closing.');
        electron_1.app.quit();
    }
    else {
        electron_1.app.on('second-instance', (event, argv, workingDirectory) => {
            electron_log_1.default.info('[Main] [] Attempt to run second instance. Showing existing window.');
            mainWindow.webContents.send('arguments-received', argv);
            // Someone tried to run a second instance, we should focus the existing window.
            if (mainWindow) {
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
                        mainWindow.show();
                        mainWindow.focus();
                    },
                },
                {
                    label: arg.exitLabel,
                    click() {
                        electron_1.app.quit();
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
    }
}
catch (e) {
    electron_log_1.default.info(`[Main] [] Could not start. Error: ${e.message}`);
    throw e;
}
//# sourceMappingURL=main.js.map