import * as remote from '@electron/remote';
import { ipcRenderer } from 'electron';
import { Desktop } from './desktop';

jest.mock('@electron/remote', () => {
    const EventEmitter = jest.requireActual<typeof import('events')>('events').EventEmitter;
    return { systemPreferences: new EventEmitter(), nativeTheme: new EventEmitter() };
});
jest.mock('electron', () => {
    const EventEmitter = jest.requireActual<typeof import('events')>('events').EventEmitter;
    return { ipcRenderer: new EventEmitter() };
});

describe('Desktop listener lifetime', () => {
    let desktop: Desktop;
    const preferences = remote.systemPreferences;
    const theme = remote.nativeTheme;

    afterEach(() => desktop?.ngOnDestroy());

    it('forwards theme and accent changes and removes listeners on unload', () => {
        desktop = new Desktop();
        const accent = jest.fn();
        const updated = jest.fn();
        desktop.accentColorChanged$.subscribe(accent);
        desktop.nativeThemeUpdated$.subscribe(updated);
        preferences.emit('accent-color-changed');
        theme.emit('updated');
        if (process.platform === 'linux') {
            ipcRenderer.emit('linux-accent-color-changed');
        }
        expect(accent).toHaveBeenCalledTimes(process.platform === 'linux' ? 2 : 1);
        expect(updated).toHaveBeenCalledTimes(1);

        window.dispatchEvent(new Event('unload'));
        desktop.ngOnDestroy();
        expect(preferences.listenerCount('accent-color-changed')).toBe(0);
        expect(theme.listenerCount('updated')).toBe(0);
        expect(ipcRenderer.listenerCount('linux-accent-color-changed')).toBe(0);
    });

    it('does not accumulate listeners across repeated window lifetimes', () => {
        for (let attempt = 0; attempt < 20; attempt++) {
            desktop = new Desktop();
            expect(preferences.listenerCount('accent-color-changed')).toBe(1);
            expect(theme.listenerCount('updated')).toBe(1);
            desktop.ngOnDestroy();
            expect(preferences.listenerCount('accent-color-changed')).toBe(0);
            expect(theme.listenerCount('updated')).toBe(0);
            expect(ipcRenderer.listenerCount('linux-accent-color-changed')).toBe(0);
        }
    });
});
