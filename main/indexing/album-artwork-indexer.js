const { Logger } = require('../common/logger');
const { AlbumArtworkRemover } = require('./album-artwork-remover');
const { AlbumArtworkAdder } = require('./album-artwork-adder');
const { parentPort } = require('worker_threads');
const { DismissMessage } = require('./messages/dismiss-message');
const { Timer } = require('../common/timer');

class AlbumArtworkIndexer {
    static async indexAlbumArtworkAsync() {
        Logger.info('+++ STARTED INDEXING ALBUM ARTWORK +++', 'AlbumArtworkIndexer', 'indexAlbumArtworkAsync');

        const timer = new Timer();
        timer.start();

        await AlbumArtworkRemover.removeAlbumArtworkThatHasNoTrackAsync();
        await AlbumArtworkRemover.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();
        await AlbumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();
        await AlbumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

        timer.stop();

        Logger.info(
            `+++ FINISHED INDEXING ALBUM ARTWORK (Time required: ${timer.elapsedMilliseconds} ms) +++`,
            'AlbumArtworkIndexer',
            'indexAlbumArtworkAsync',
        );

        parentPort?.postMessage(new DismissMessage());
    }
}

exports.AlbumArtworkIndexer = AlbumArtworkIndexer;
