jest.mock('electron', () => ({ app: { getPath: jest.fn(() => '/test-user-data') } }));
jest.mock('fs-extra', () => ({
    existsSync: jest.fn(() => true),
    readFileSync: jest.fn(),
    writeFileSync: jest.fn(),
    renameSync: jest.fn(),
}));

const fs = require('fs-extra');
const { SettingsStore } = require('./common/settings/settings-store.ts');

it('defaults the tray double-click setting to disabled and preserves a saved preference', () => {
    fs.readFileSync.mockReturnValue('{}');
    const store = new SettingsStore();
    expect(store.get('showWindowOnTrayDoubleClick')).toBe(false);

    store.set('showWindowOnTrayDoubleClick', true);
    const savedSettings = fs.writeFileSync.mock.calls[fs.writeFileSync.mock.calls.length - 1][1];
    fs.readFileSync.mockReturnValue(savedSettings);
    expect(new SettingsStore().get('showWindowOnTrayDoubleClick')).toBe(true);
});
