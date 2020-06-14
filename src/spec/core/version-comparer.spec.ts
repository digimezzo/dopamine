import * as assert from 'assert';
import { VersionComparer } from '../../app/core/version-comparer';

describe('VersionComparer', () => {
    describe('isNewerVersion', () => {
        it('Should report is newer version when old version is older than new version', async () => {
            // Arrange
            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('2.0.3', '2.0.4');

            // Assert
            assert.ok(isNewerVersion);
        });

        it('Should not report is newer version when old version is same as new version', async () => {
            // Arrange
            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('2.0.3', '2.0.3');

            // Assert
            assert.ok(!isNewerVersion);
        });

        it('Should  not report is newer version when old version is newer than new version', async () => {
            // Arrange
            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('2.0.4', '2.0.3');

            // Assert
            assert.ok(!isNewerVersion);
        });
    });
});
