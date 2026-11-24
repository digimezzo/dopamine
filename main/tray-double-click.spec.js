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
            this.setContextMenu = jest.fn();
        }
    }

    const display = { workArea: { x: 0, y: 0, width: 1920, height: 1080 } };
    return {
        app,
        BrowserWindow: jest.fn(() => new BrowserWindow()),
        Tray: jest.fn(() => new Tray()),
        ipcMain: { on: jest.fn(), handle: jest.fn() },
        Menu: { setApplicationMenu: jest.fn(), buildFromTemplate: jest.fn((template) => template) },
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
        updateMenu: electron.ipcMain.on.mock.calls.find(([channel]) => channel === 'update-tray-context-menu')[1],
    };
}

describe('tray interaction', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        Object.defineProperty(process, 'platform', originalPlatform);
    });

    it.each(['click', 'double-click'])('shows and focuses the Windows window on %s', async (event) => {
        const { tray, window } = await startApp('win32');
        window.isMinimized.mockReturnValue(true);
        tray.emit(event);
        expect(window.show).toHaveBeenCalledTimes(1);
        expect(window.restore).toHaveBeenCalledTimes(1);
        expect(window.focus).toHaveBeenCalledTimes(1);

        window.isMinimized.mockReturnValue(false);
        tray.emit(event);
        expect(window.show).toHaveBeenCalledTimes(2);
        expect(window.restore).toHaveBeenCalledTimes(1);
        expect(window.focus).toHaveBeenCalledTimes(2);
    });

    it.each(['click', 'double-click'])('does nothing on %s if there is no window', async (event) => {
        const { tray } = await startApp('win32', false);
        expect(() => tray.emit(event)).not.toThrow();
    });

    it.each(['win32', 'darwin', 'linux'])('keeps the tray context menu on %s', async (platform) => {
        const { tray, window, updateMenu } = await startApp(platform);
        updateMenu({}, { showDopamineLabel: 'Show Dopamine', exitLabel: 'Exit' });
        const menu = tray.setContextMenu.mock.calls[0][0];
        expect(menu.map((item) => item.label)).toEqual(['Show Dopamine', 'Exit']);
        tray.emit('right-click');
        expect(window.show).not.toHaveBeenCalled();
        menu[0].click();
        expect(window.show).toHaveBeenCalledTimes(1);
        expect(window.focus).toHaveBeenCalledTimes(1);
    });

    it.each(['darwin', 'linux'])('does not register window-opening click handlers on %s', async (platform) => {
        const { tray, window } = await startApp(platform);
        tray.emit('click');
        tray.emit('double-click');
        expect(window.show).not.toHaveBeenCalled();
    });
});
