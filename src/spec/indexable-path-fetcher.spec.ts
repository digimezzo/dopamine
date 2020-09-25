import * as assert from 'assert';
import { IndexablePath } from '../app/services/indexing/indexable-path';
import { IndexablePathFetcherMock } from './mocking/indexable-path-fetcher-mock';

describe('IndexablePathFetcher', () => {
    describe('getIndexablePathsForAllFoldersAsync', () => {
        it('Should collect supported audio files for all folders', async () => {
            // Arrange
            const mock: IndexablePathFetcherMock = new IndexablePathFetcherMock();

            // Act
            const indexablePaths: IndexablePath[] = await mock.indexablePathFetcher.getIndexablePathsForAllFoldersAsync();

            // Assert
            assert.ok(indexablePaths.map(x => x.path).includes('/home/user/Music/Track 1.mp3'));
            assert.ok(indexablePaths.map(x => x.path).includes('/home/user/Music/Track 2.mp3'));
            assert.ok(indexablePaths.map(x => x.path).includes('/home/user/Downloads/Track 1.mp3'));
            assert.ok(indexablePaths.map(x => x.path).includes('/home/user/Downloads/Track 2.mp3'));
        });

        it('Should not collect unsupported audio files for all folders', async () => {
            // Arrange
            const mock: IndexablePathFetcherMock = new IndexablePathFetcherMock();

            // Act
            const indexablePaths: IndexablePath[] = await mock.indexablePathFetcher.getIndexablePathsForAllFoldersAsync();

            // Assert
            assert.ok(!indexablePaths.map(x => x.path).includes('/home/user/Music/Image 1.png'));
            assert.ok(!indexablePaths.map(x => x.path).includes('/home/user/Music/Image 2'));
            assert.ok(!indexablePaths.map(x => x.path).includes('/home/user/Downloads/Image 1.png'));
            assert.ok(!indexablePaths.map(x => x.path).includes('/home/user/Downloads/Image 2'));
        });
    });
});
