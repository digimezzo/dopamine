const { parentPort, workerData } = require('worker_threads');
const { Indexer } = require('../indexing/indexer');
const { Logger } = require('../common/logger');

const { arg } = workerData;

async function performTaskAsync() {
    try {
        if (arg.task === 'outdated') {
            await Indexer.indexCollectionIfOutdatedAsync();
        } else if (arg.task === 'foldersChanged') {
            await Indexer.indexCollectionIfFoldersHaveChangedAsync();
        } else if (arg.task === 'always') {
            await Indexer.indexCollectionAlwaysAsync();
        } else if (arg.task === 'albumArtwork') {
            await Indexer.indexAlbumArtworkOnlyAsync();
        }
    } catch (e) {
        Logger.error(e, 'Unexpected error', 'IndexingWorker', 'performTaskAsync');
    }
}

performTaskAsync().then(() => {
    parentPort?.postMessage('Done');
});
