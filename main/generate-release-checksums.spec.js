const { spawnSync } = require('child_process');
const { createHash } = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const describeOnLinux = process.platform === 'linux' ? describe : describe.skip;

describeOnLinux('release checksums', () => {
    const script = path.join(__dirname, '../scripts/generate-release-checksums.sh');
    const assets = [
        ['rpm', 'Dopamine-1.0.rpm'],
        ['deb', 'Dopamine-1.0.deb'],
        ['appimage', 'Dopamine-1.0.AppImage'],
        ['snap', 'Dopamine-1.0.snap'],
        ['pacman', 'Dopamine-1.0.pacman'],
        ['macos-arm', 'Dopamine-1.0-arm.dmg'],
        ['macos-intel', 'Dopamine-1.0-intel.dmg'],
        ['windows-installer', 'Dopamine-1.0.exe'],
    ];
    let directory;

    beforeEach(() => {
        directory = fs.mkdtempSync(path.join(os.tmpdir(), 'dopamine-checksums-'));
    });

    afterEach(() => {
        fs.rmSync(directory, { recursive: true, force: true });
    });

    function createAssets(build) {
        for (const [artifact, filename] of assets) {
            const artifactDirectory = path.join(directory, `dopamine-${build}-${artifact}`);
            fs.mkdirSync(artifactDirectory);
            fs.writeFileSync(path.join(artifactDirectory, filename), artifact);
        }
    }

    test.each(['nightly', 'merge'])('generates verifiable checksums for all %s assets', (build) => {
        createAssets(build);
        const result = spawnSync('bash', [script, directory, build], { encoding: 'utf8' });
        expect(result.status).toBe(0);
        const expected = assets.map(([artifact, filename]) => {
            const hash = createHash('sha256').update(artifact).digest('hex');
            return `${hash}  ${filename}`;
        });
        expect(result.stdout).toBe(`${expected.join('\n')}\n`);

        const releaseDirectory = path.join(directory, 'release');
        fs.mkdirSync(releaseDirectory);
        for (const [artifact, filename] of assets) {
            fs.copyFileSync(path.join(directory, `dopamine-${build}-${artifact}`, filename), path.join(releaseDirectory, filename));
        }
        fs.writeFileSync(path.join(releaseDirectory, 'SHA256SUMS.txt'), result.stdout);
        const verification = spawnSync('sha256sum', ['-c', 'SHA256SUMS.txt'], { cwd: releaseDirectory, encoding: 'utf8' });
        expect(verification.status).toBe(0);
    });

    test('fails if an expected asset is missing', () => {
        createAssets('nightly');
        fs.unlinkSync(path.join(directory, 'dopamine-nightly-pacman', 'Dopamine-1.0.pacman'));
        const result = spawnSync('bash', [script, directory, 'nightly'], { encoding: 'utf8' });
        expect(result.status).not.toBe(0);
        expect(result.stderr).toContain('Expected exactly one Dopamine-*.pacman');
    });

    test('fails if an artifact contains multiple matching assets', () => {
        createAssets('merge');
        fs.writeFileSync(path.join(directory, 'dopamine-merge-rpm', 'Dopamine-extra.rpm'), 'extra');
        const result = spawnSync('bash', [script, directory, 'merge'], { encoding: 'utf8' });
        expect(result.status).not.toBe(0);
        expect(result.stderr).toContain('found 2');
    });
});
