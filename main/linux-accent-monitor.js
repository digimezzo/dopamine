const { spawn } = require('child_process');

function startLinuxAccentMonitor({ app, BrowserWindow, log }) {
    let stopping = false;
    let monitor;
    try {
        monitor = spawn('gdbus', [
            'monitor',
            '--session',
            '--dest',
            'org.freedesktop.portal.Desktop',
            '--object-path',
            '/org/freedesktop/portal/desktop',
        ], { stdio: ['ignore', 'pipe', 'ignore'] });
    } catch (error) {
        log.warn(`[App] Could not start Linux accent color monitor: ${error.message}`);
        return;
    }

    monitor.stdout.on('data', (data) => {
        if (data.toString().includes('accent-color')) {
            for (const window of BrowserWindow.getAllWindows()) {
                if (!window.isDestroyed() && !window.webContents.isDestroyed()) {
                    window.webContents.send('linux-accent-color-changed');
                }
            }
        }
    });
    monitor.on('error', (error) => {
        log.warn(`[App] Linux accent color monitor failed: ${error.message}`);
    });
    monitor.on('exit', (code, signal) => {
        if (!stopping) {
            log.warn(`[App] Linux accent color monitor exited (code=${code}, signal=${signal}).`);
        }
    });
    app.once('will-quit', () => {
        stopping = true;
        if (monitor.exitCode === null && monitor.signalCode === null && !monitor.kill()) {
            log.warn('[App] Could not stop Linux accent color monitor.');
        }
    });
}

module.exports = { startLinuxAccentMonitor };
