const { Ioc } = require('../ioc/ioc');
const log = require('electron-log');
const path = require('path');

async function performTaskAsync() {
    Ioc.registerAll();

    const indexer = Ioc.get('Indexer');
    const workerProxy = Ioc.get('WorkerProxy');
    const logger = Ioc.get('Logger');

    log.transports.file.resolvePath = () => path.join(workerProxy.applicationDataDirectory(), 'logs', 'Dopamine.log');

    try {
        if (workerProxy.task() === 'outdated') {
            await indexer.indexCollectionIfOutdatedAsync();
        } else if (workerProxy.task() === 'always') {
            await indexer.indexCollectionAlwaysAsync();
        }
    } catch (e) {
        logger.error(e, 'Unexpected error', 'IndexingWorker', 'performTaskAsync');
    }
}

performTaskAsync().then(() => {
    const workerProxy = Ioc.get('WorkerProxy');
    workerProxy.postMessage('Done');
});
