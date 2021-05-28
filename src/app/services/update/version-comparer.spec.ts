import { VersionComparer } from './version-comparer';

describe('VersionComparer', () => {
    describe('isNewerVersion', () => {
        it('should report newer version when old version is release and is older than new version which is release', async () => {
            // Arrange

            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('2.0.3', '2.0.4');

            // Assert
            expect(isNewerVersion).toBeTruthy();
        });

        it('should not report newer version when old version is release and is same as new version which is release', async () => {
            // Arrange

            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('2.0.3', '2.0.3');

            // Assert
            expect(isNewerVersion).toBeFalsy();
        });

        it('should  not report newer version when old version is release and is newer than new version which is release', async () => {
            // Arrange

            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('2.0.4', '2.0.3');

            // Assert
            expect(isNewerVersion).toBeFalsy();
        });
    });
});
