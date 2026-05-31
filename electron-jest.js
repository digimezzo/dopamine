const { spawnSync, spawn } = require('child_process');

// correct encoding for the Windows terminal
if (process.platform === 'win32') {
    spawnSync('chcp', ['65001'], {
        shell: true,
        stdio: 'inherit',
    });
}

process.env.ELECTRON_RUN_AS_NODE = 'true';

const jestArgs = process.argv.slice(2);
spawn('electron', ['./node_modules/jest/bin/jest.js', '--colors', ...jestArgs], {
    shell: true,
    stdio: 'inherit',
    env: process.env,
});
