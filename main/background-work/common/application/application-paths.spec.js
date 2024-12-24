const { ApplicationPaths } = require('./application-paths');
const { FileAccessMock } = require('../../mocks/file-access-mock');
const { WorkerProxyMock } = require('../../mocks/worker-proxy-mock');

describe('ApplicationPaths', () => {
    let fileAccessMock;
    let workerProxyMock;

    beforeEach(() => {
        fileAccessMock = new FileAccessMock();
        workerProxyMock = new WorkerProxyMock();
    });

    function createSut() {
        return new ApplicationPaths(fileAccessMock, workerProxyMock);
    }

    describe('getCoverArtCacheFullPath', () => {
        it('should return the full path to the cover art cache', () => {
            // Arrange
            workerProxyMock.applicationDataDirectoryReturnValue = 'C:\\Users\\User\\AppData\\Roaming\\Dopamine';
            fileAccessMock.combinePathReturnValue = 'C:\\Users\\User\\AppData\\Roaming\\Dopamine\\Cache\\CoverArt';

            const sut = createSut();

            // Act
            sut.getCoverArtCacheFullPath();

            // Assert
            expect(fileAccessMock.combinePathCalls.length).toEqual(1);
            expect(fileAccessMock.combinePathCalls[0]).toEqual(['C:\\Users\\User\\AppData\\Roaming\\Dopamine', 'Cache', 'CoverArt']);
            expect(sut.getCoverArtCacheFullPath()).toEqual('C:\\Users\\User\\AppData\\Roaming\\Dopamine\\Cache\\CoverArt');
        });
    });
});
