const { Logger } = require('../common/logger');
const { AlbumArtworkRemover } = require('./album-artwork-remover');
const { AlbumArtworkAdder } = require('./album-artwork-adder');
const { Timer } = require('../common/scheduling/timer');

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
            `+++ FINISHED INDEXING ALBUM ARTWORK (Time required: ${timer.getElapsedMilliseconds()} ms) +++`,
            'AlbumArtworkIndexer',
            'indexAlbumArtworkAsync',
        );
    }
}

exports.AlbumArtworkIndexer = AlbumArtworkIndexer;
