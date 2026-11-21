jest.mock('electron', () => {
    const { EventEmitter } = require('events');
    const app = new EventEmitter();
    app.commandLine = { appendSwitch: jest.fn() };
    app.getPath = jest.fn(() => '/test-user-data');
    app.requestSingleInstanceLock = jest.fn(() => true);
    app.whenReady = jest.fn(() => Promise.resolve());
    app.setAppUserModelId = jest.fn();

    class BrowserWindow extends EventEmitter {
        constructor() {
            super();
            this.webContents = new EventEmitter();
            this.show = jest.fn();
            this.focus = jest.fn();
            this.restore = jest.fn();
            this.isMinimized = jest.fn(() => false);
            this.setPosition = jest.fn();
            this.setMinimumSize = jest.fn();
            this.setSize = jest.fn();
            this.loadURL = jest.fn();
        }
    }

    class Tray extends EventEmitter {
        constructor() {
            super();
            this.setToolTip = jest.fn();
        }
    }

    const display = { workArea: { x: 0, y: 0, width: 1920, height: 1080 } };
    return {
        app,
        BrowserWindow: jest.fn(() => new BrowserWindow()),
        Tray: jest.fn(() => new Tray()),
        ipcMain: { on: jest.fn(), handle: jest.fn() },
        Menu: { setApplicationMenu: jest.fn() },
        nativeTheme: new EventEmitter(),
        protocol: { registerFileProtocol: jest.fn() },
        screen: { getPrimaryDisplay: () => display, getDisplayMatching: () => display },
    };
});

jest.mock('electron-log', () => ({
    create: jest.fn(),
    transports: { file: {} },
    info: jest.fn(),
    error: jest.fn(),
}));
jest.mock('@electron/remote/main', () => ({ initialize: jest.fn(), enable: jest.fn() }));
jest.mock('./api/discord/discord-api', () => ({ DiscordApi: jest.fn() }));
jest.mock('./linux-accent-monitor', () => ({ startLinuxAccentMonitor: jest.fn() }));
jest.mock('./common/settings/settings-store', () => ({
    SettingsStore: jest.fn().mockImplementation(() => ({
        get: (key) => mockSettings[key],
        set: (key, value) => (mockSettings[key] = value),
    })),
}));

let mockSettings;
const originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');

async function startApp(platform, createWindow = true) {
    jest.resetModules();
    Object.defineProperty(process, 'platform', { value: platform, configurable: true });
    mockSettings = {
        showIconInNotificationArea: true,
        showWindowOnTrayDoubleClick: false,
        fullPlayerPositionSizeMaximized: '50;50;1000;650;0',
        playerType: 'full',
    };
    const electron = require('electron');
    require('../main.ts');
    if (createWindow) electron.app.emit('ready');
    await Promise.resolve();
    return {
        tray: electron.Tray.mock.results[0].value,
        window: createWindow ? electron.BrowserWindow.mock.results[0].value : undefined,
        setSetting: electron.ipcMain.handle.mock.calls.find(([channel]) => channel === 'settings:set')[1],
    };
}

describe('tray double-click', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        Object.defineProperty(process, 'platform', originalPlatform);
    });

    it('uses the current Windows setting and restores a minimized window', async () => {
        const { tray, window, setSetting } = await startApp('win32');
        tray.emit('double-click');
        expect(window.show).not.toHaveBeenCalled();

        setSetting({}, 'showWindowOnTrayDoubleClick', true);
        window.isMinimized.mockReturnValue(true);
        tray.emit('double-click');
        expect(window.show).toHaveBeenCalledTimes(1);
        expect(window.restore).toHaveBeenCalledTimes(1);
        expect(window.focus).toHaveBeenCalledTimes(1);

        window.isMinimized.mockReturnValue(false);
        tray.emit('double-click');
        expect(window.show).toHaveBeenCalledTimes(2);
        expect(window.restore).toHaveBeenCalledTimes(1);
        expect(window.focus).toHaveBeenCalledTimes(2);

        setSetting({}, 'showWindowOnTrayDoubleClick', false);
        tray.emit('double-click');
        expect(window.show).toHaveBeenCalledTimes(2);
    });

    it('does nothing if there is no window', async () => {
        const { tray } = await startApp('win32', false);
        mockSettings.showWindowOnTrayDoubleClick = true;
        expect(() => tray.emit('double-click')).not.toThrow();
    });

    it.each(['darwin', 'linux'])('does not register the behavior on %s', async (platform) => {
        const { tray, window } = await startApp(platform);
        mockSettings.showWindowOnTrayDoubleClick = true;
        tray.emit('double-click');
        expect(window.show).not.toHaveBeenCalled();
    });
});
