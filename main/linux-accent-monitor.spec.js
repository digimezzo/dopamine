const { EventEmitter, once } = require('events');
const childProcess = require('child_process');
const { startLinuxAccentMonitor } = require('./linux-accent-monitor');

jest.mock('child_process', () => ({ spawn: jest.fn() }));

describe('Linux accent color monitor', () => {
    let app;
    let monitor;
    let log;
    let windows;

    beforeEach(() => {
        app = new EventEmitter();
        monitor = Object.assign(new EventEmitter(), {
            stdout: new EventEmitter(),
            exitCode: null,
            signalCode: null,
            kill: jest.fn(() => true),
        });
        childProcess.spawn.mockReset().mockReturnValue(monitor);
        log = { warn: jest.fn() };
        windows = [];
    });

    function start() {
        startLinuxAccentMonitor({ app, BrowserWindow: { getAllWindows: () => windows }, log });
    }

    test('broadcasts accent changes only to live windows', () => {
        const send = jest.fn();
        windows.push(
            { isDestroyed: () => false, webContents: { isDestroyed: () => false, send } },
            { isDestroyed: () => true },
            { isDestroyed: () => false, webContents: { isDestroyed: () => true } },
        );
        start();
        monitor.stdout.emit('data', Buffer.from('other-setting'));
        expect(send).not.toHaveBeenCalled();
        monitor.stdout.emit('data', Buffer.from('accent-color'));
        expect(send).toHaveBeenCalledWith('linux-accent-color-changed');
        expect(childProcess.spawn).toHaveBeenCalledTimes(1);
        expect(childProcess.spawn).toHaveBeenCalledWith('gdbus', expect.arrayContaining(['monitor', '--session']), expect.any(Object));
    });

    test('keeps running when quit is cancelled and stops on final quit', () => {
        start();
        app.emit('before-quit');
        expect(monitor.kill).not.toHaveBeenCalled();
        app.emit('will-quit');
        app.emit('will-quit');
        expect(monitor.kill).toHaveBeenCalledTimes(1);
        monitor.emit('exit', null, 'SIGTERM');
        expect(log.warn).not.toHaveBeenCalled();
    });

    test('reports process and termination failures', () => {
        start();
        monitor.emit('error', new Error('missing gdbus'));
        monitor.emit('exit', 1, null);
        monitor.kill.mockReturnValue(false);
        app.emit('will-quit');
        expect(log.warn).toHaveBeenCalledTimes(3);
    });

    test('does not kill a monitor that already exited', () => {
        start();
        monitor.exitCode = 1;
        app.emit('will-quit');
        expect(monitor.kill).not.toHaveBeenCalled();
    });

    test('terminates a real child process at quit', async () => {
        const spawn = jest.requireActual('child_process').spawn;
        const child = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], { stdio: ['ignore', 'pipe', 'ignore'] });
        childProcess.spawn.mockReturnValue(child);
        try {
            await once(child, 'spawn');
            start();
            const exited = once(child, 'exit');
            app.emit('will-quit');
            const [code, signal] = await exited;
            expect(code).toBeNull();
            expect(signal).toBe('SIGTERM');
        } finally {
            if (child.exitCode === null && child.signalCode === null) {
                child.kill();
            }
        }
    });
});
