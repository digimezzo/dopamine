"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var electron_log_1 = require("electron-log");
var Store = require("electron-store");
var windowStateKeeper = require("electron-window-state");
var os = require("os");
var path = require("path");
var url = require("url");
/**
 * Command line parameters
 */
electron_1.app.commandLine.appendSwitch('disable-color-correct-rendering');
electron_1.app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
/**
 * Logging
 */
electron_log_1.default.create('main');
electron_log_1.default.transports.file.resolvePath = function () { return path.join(electron_1.app.getPath('userData'), 'logs', 'Dopamine.log'); };
/**
 * Variables
 */
var globalAny = global; // Global does not allow setting custom properties. We need to cast it to "any" first.
var settings = new Store();
var args = process.argv.slice(1);
var isServing = args.some(function (val) { return val === '--serve'; });
var mainWindow;
var tray;
var isQuitting;
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
    if (electron_1.nativeTheme.shouldUseDarkColors) {
        return path.join(globalAny.__static, os.platform() === 'win32' ? 'icons/white.ico' : 'icons/white.png');
    }
    return path.join(globalAny.__static, os.platform() === 'win32' ? 'icons/black.ico' : 'icons/black.png');
}
function createMainWindow() {
    // Suppress the default menu
    electron_1.Menu.setApplicationMenu(undefined);
    // Load the previous state with fallback to defaults
    var windowState = windowStateKeeper({
        defaultWidth: 870,
        defaultHeight: 620,
    });
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
            enableRemoteModule: true,
            contextIsolation: false,
        },
        show: false,
    });
    globalAny.windowHasFrame = windowHasFrame();
    windowState.manage(mainWindow);
    if (isServing) {
        require('electron-reload')(__dirname, {
            electron: require(__dirname + "/node_modules/electron"),
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
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = undefined;
    });
    // 'ready-to-show' doesn't fire on Windows in dev mode. In prod it seems to work.
    // See: https://github.com/electron/electron/issues/7779
    mainWindow.on('ready-to-show', function () {
        mainWindow.show();
        mainWindow.focus();
    });
    // Makes links open in external browser
    var handleRedirect = function (e, localUrl) {
        // Check that the requested url is not the current page
        if (localUrl !== mainWindow.webContents.getURL()) {
            e.preventDefault();
            require('electron').shell.openExternal(localUrl);
        }
    };
    mainWindow.webContents.on('will-navigate', handleRedirect);
    mainWindow.webContents.on('new-window', handleRedirect);
    mainWindow.webContents.on('before-input-event', function (event, input) {
        if (input.key.toLowerCase() === 'f12') {
            // if (serve) {
            mainWindow.webContents.toggleDevTools();
            // }
            event.preventDefault();
        }
    });
    mainWindow.on('minimize', function (event) {
        if (shouldMinimizeToNotificationArea()) {
            event.preventDefault();
            mainWindow.hide();
        }
    });
    mainWindow.on('close', function (event) {
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
    var gotTheLock = electron_1.app.requestSingleInstanceLock();
    if (!gotTheLock) {
        electron_log_1.default.info('[Main] [] There is already another instance running. Closing.');
        electron_1.app.quit();
    }
    else {
        electron_1.app.on('second-instance', function (event, argv, workingDirectory) {
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
        electron_1.app.on('window-all-closed', function () {
            electron_log_1.default.info('[App] [window-all-closed] +++ Stopping +++');
            // On OS X it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform !== 'darwin') {
                electron_1.app.quit();
            }
        });
        electron_1.app.on('activate', function () {
            // On OS X it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (mainWindow == undefined) {
                createMainWindow();
            }
        });
        electron_1.app.on('before-quit', function () {
            isQuitting = true;
        });
        electron_1.app.whenReady().then(function () {
            // See: https://github.com/electron/electron/issues/23757
            electron_1.protocol.registerFileProtocol('file', function (request, callback) {
                var pathname = decodeURI(request.url.replace('file:///', ''));
                callback(pathname);
            });
            if (shouldShowIconInNotificationArea()) {
                tray = new electron_1.Tray(getTrayIcon());
                tray.setToolTip('Dopamine');
            }
        });
        electron_1.nativeTheme.on('updated', function () {
            if (tray == undefined) {
                return;
            }
            tray.setImage(getTrayIcon());
        });
        electron_1.ipcMain.on('update-tray-context-menu', function (event, arg) {
            if (tray == undefined) {
                return;
            }
            var contextMenu = electron_1.Menu.buildFromTemplate([
                {
                    label: arg.showDopamineLabel,
                    click: function () {
                        mainWindow.show();
                        mainWindow.focus();
                    },
                },
                {
                    label: arg.exitLabel,
                    click: function () {
                        electron_1.app.quit();
                    },
                },
            ]);
            tray.setContextMenu(contextMenu);
        });
    }
}
catch (e) {
    electron_log_1.default.info("[Main] [] Could not start. Error: " + e.message);
    throw e;
}
//# sourceMappingURL=main.js.map