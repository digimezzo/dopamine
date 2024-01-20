const { ApplicationPaths } = require("./application-paths");
describe('ApplicationPaths', () => {
    describe('getCoverArtCacheFullPath', () => {
        it('should return the full path to the cover art cache', () => {
            // Arrange, Act
            const path = ApplicationPaths.getCoverArtCacheFullPath();

            // Assert
            expect(path).not.toBeNull();
        });
    });
});
