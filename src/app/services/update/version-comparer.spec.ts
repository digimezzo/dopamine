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

        it('should not report newer version if old version is the same as new version but new version has "preview" suffix', async () => {
            // Arrange

            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('3.0.0', '3.0.0-preview.1');

            // Assert
            expect(isNewerVersion).toBeFalsy();
        });

        it('should not report newer version if old version is the same as new version but new version has "rc" suffix', async () => {
            // Arrange

            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('3.0.0', '3.0.0-rc.1');

            // Assert
            expect(isNewerVersion).toBeFalsy();
        });

        it('should not report newer version if old version is newer than new version and old version has "preview" suffix', async () => {
            // Arrange

            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('3.0.1-preview.1', '3.0.0');

            // Assert
            expect(isNewerVersion).toBeFalsy();
        });

        it('should not report newer version if old version is newer than new version and old version has "rc" suffix', async () => {
            // Arrange

            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('3.0.1-rc.1', '3.0.0');

            // Assert
            expect(isNewerVersion).toBeFalsy();
        });

        it('should report newer version if old version is older than new version and old version has "preview" suffix', async () => {
            // Arrange

            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('3.0.0-preview.1', '3.0.1');

            // Assert
            expect(isNewerVersion).toBeTruthy();
        });

        it('should report newer version if old version is older than new version and old version has "rc" suffix', async () => {
            // Arrange

            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('3.0.0-rc.1', '3.0.1');

            // Assert
            expect(isNewerVersion).toBeTruthy();
        });

        it('should not report newer version if old version is newer than new version and new version has "preview" suffix', async () => {
            // Arrange

            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('3.0.1', '3.0.0-preview.1');

            // Assert
            expect(isNewerVersion).toBeFalsy();
        });

        it('should not report newer version if old version is newer than new version and new version has "rc" suffix', async () => {
            // Arrange

            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('3.0.1', '3.0.0-rc.1');

            // Assert
            expect(isNewerVersion).toBeFalsy();
        });

        it('should report newer version if old version is older than new version and new version has "preview" suffix', async () => {
            // Arrange

            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('3.0.0', '3.0.1-preview.1');

            // Assert
            expect(isNewerVersion).toBeTruthy();
        });

        it('should report newer version if old version is older than new version and new version has "rc" suffix', async () => {
            // Arrange

            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('3.0.0', '3.0.1-rc.1');

            // Assert
            expect(isNewerVersion).toBeTruthy();
        });

        it('should report newer version if both old and new version are "preview" versions with same version number but new version has higher iteration', async () => {
            // Arrange

            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('3.0.0-preview.1', '3.0.0-preview.2');

            // Assert
            expect(isNewerVersion).toBeTruthy();
        });

        it('should report newer version if both old and new version are "rc" versions with same version number but new version has higher iteration', async () => {
            // Arrange

            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('3.0.0-rc.1', '3.0.0-rc.2');

            // Assert
            expect(isNewerVersion).toBeTruthy();
        });

        it('should report not newer version if both old and new version are "preview" versions with same version number but new version has lower iteration', async () => {
            // Arrange

            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('3.0.0-preview.2', '3.0.0-preview.1');

            // Assert
            expect(isNewerVersion).toBeFalsy();
        });

        it('should report not newer version if both old and new version are "rc" versions with same version number but new version has lower iteration', async () => {
            // Arrange

            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('3.0.0-rc.2', '3.0.0-rc.1');

            // Assert
            expect(isNewerVersion).toBeFalsy();
        });

        it('should report newer version if old version is "preview" version and new version is "rc" version and both have the same version number and iteration', async () => {
            // Arrange

            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('3.0.0-preview.1', '3.0.0-rc.1');

            // Assert
            expect(isNewerVersion).toBeTruthy();
        });

        it('should report not newer version if old version is "rc" version and new version is "preview" version and both have the same version number and iteration', async () => {
            // Arrange

            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('3.0.0-rc.1', '3.0.0-preview.1');

            // Assert
            expect(isNewerVersion).toBeFalsy();
        });

        it('should report not newer version if old version is "rc" version and new version is "preview" version and iteration of new version is higher', async () => {
            // Arrange

            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('3.0.0-rc.1', '3.0.0-preview.2');

            // Assert
            expect(isNewerVersion).toBeFalsy();
        });

        it('should report not newer version if old version is "rc" version and new version is "preview" version and iteration of new version is lower', async () => {
            // Arrange

            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('3.0.0-rc.5', '3.0.0-preview.1');

            // Assert
            expect(isNewerVersion).toBeFalsy();
        });

        it('should report newer version if old version is "preview" version and new version is "rc" version and iteration of new version is lower', async () => {
            // Arrange

            // Act
            const isNewerVersion: boolean = VersionComparer.isNewerVersion('3.0.0-preview.6', '3.0.0-rc.1');

            // Assert
            expect(isNewerVersion).toBeTruthy();
        });
    });
});
