const { Timer } = require('../common/scheduling/timer');

class AlbumArtworkIndexer {
    constructor(albumArtworkRemover, albumArtworkAdder, logger) {
        this.albumArtworkRemover = albumArtworkRemover;
        this.albumArtworkAdder = albumArtworkAdder;
        this.logger = logger;
    }

    async indexAlbumArtworkAsync() {
        this.logger.info('+++ STARTED INDEXING ALBUM ARTWORK +++', 'AlbumArtworkIndexer', 'indexAlbumArtworkAsync');

        const timer = new Timer();
        timer.start();

        await this.albumArtworkRemover.removeAlbumArtworkThatHasNoTrackAsync();
        await this.albumArtworkRemover.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();
        await this.albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();
        await this.albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

        timer.stop();

        this.logger.info(
            `+++ FINISHED INDEXING ALBUM ARTWORK (Time required: ${timer.getElapsedMilliseconds()} ms) +++`,
            'AlbumArtworkIndexer',
            'indexAlbumArtworkAsync',
        );
    }
}

exports.AlbumArtworkIndexer = AlbumArtworkIndexer;
