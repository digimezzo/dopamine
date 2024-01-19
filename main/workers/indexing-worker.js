const { Indexer } = require('../indexing/indexer');
const { Logger } = require('../common/logger');
const { WorkerProxy } = require('./worker-proxy');

async function performTaskAsync() {
    try {
        if (WorkerProxy.task() === 'outdated') {
            await Indexer.indexCollectionIfOutdatedAsync();
        } else if (WorkerProxy.task() === 'always') {
            await Indexer.indexCollectionAlwaysAsync();
        } else if (WorkerProxy.task() === 'albumArtwork') {
            await Indexer.indexAlbumArtworkOnlyAsync();
        }
    } catch (e) {
        Logger.error(e, 'Unexpected error', 'IndexingWorker', 'performTaskAsync');
    }
}

performTaskAsync().then(() => {
    WorkerProxy.postMessage('Done');
});
