const { DateTime } = require('../common/date-time');
const { FileAccess } = require('../common/io/file-access');
const { WorkerProxy } = require('../worker-proxy');
const { DatabaseFactory } = require('../data/database.factory');
const { FolderRepository } = require('../data/folder-repository');
const { FolderTrackRepository } = require('../data/folder-track-repository');
const { RemovedTrackRepository } = require('../data/removed-track-repository');
const { LastfmApi } = require('../common/api/lastfm.api');
const { ApplicationPaths } = require('../common/application/application-paths');
const { GuidFactory } = require('../common/guid.factory');
const { Logger } = require('../common/logger');
const { TrackVerifier } = require('../indexing/track-verifier');
const { MimeTypes } = require('../indexing/mime-types');
const { DirectoryWalker } = require('../indexing/directory-walker');
const { MetadataPatcher } = require('../indexing/metadata-patcher');
const { TrackFieldCreator } = require('../indexing/track-field-creator');
const { TrackRepository } = require('../data/track-repository');
const { FileMetadataFactory } = require('../indexing/file-metadata.factory');
const { IndexablePathFetcher } = require('../indexing/indexable-path-fetcher');
const { AlbumKeyGenerator } = require('../indexing/album-key-generator');
const { TrackFiller } = require('../indexing/track-filler');
const { CollectionChecker } = require('../indexing/collection-checker');
const { TrackUpdater } = require('../indexing/track-updater');
const { TrackRemover } = require('../indexing/track-remover');
const { TrackAdder } = require('../indexing/track-adder');
const { Indexer } = require('../indexing/indexer');
const { TrackIndexer } = require('../indexing/track-indexer');

global.iocContainer = new Map();

class Ioc {
    static registerAll() {
        global.iocContainer.set('WorkerProxy', new WorkerProxy());
        global.iocContainer.set('DateTime', new DateTime());
        global.iocContainer.set('LastfmApi', new LastfmApi());
        global.iocContainer.set('GuidFactory', new GuidFactory());
        global.iocContainer.set('Logger', new Logger());
        global.iocContainer.set('MimeTypes', new MimeTypes());
        global.iocContainer.set('MetadataPatcher', new MetadataPatcher());
        global.iocContainer.set('FileMetadataFactory', new FileMetadataFactory());
        global.iocContainer.set('AlbumKeyGenerator', new AlbumKeyGenerator());

        global.iocContainer.set('FileAccess', new FileAccess(Ioc.get('DateTime')));

        global.iocContainer.set('TrackVerifier', new TrackVerifier(Ioc.get('FileAccess')));
        global.iocContainer.set('DirectoryWalker', new DirectoryWalker(Ioc.get('FileAccess')));

        global.iocContainer.set('ApplicationPaths', new ApplicationPaths(Ioc.get('FileAccess'), Ioc.get('WorkerProxy')));
        global.iocContainer.set('DatabaseFactory', new DatabaseFactory(Ioc.get('FileAccess'), Ioc.get('WorkerProxy')));

        global.iocContainer.set('FolderRepository', new FolderRepository(Ioc.get('DatabaseFactory')));
        global.iocContainer.set('FolderTrackRepository', new FolderTrackRepository(Ioc.get('DatabaseFactory')));
        global.iocContainer.set('RemovedTrackRepository', new RemovedTrackRepository(Ioc.get('DatabaseFactory')));
        global.iocContainer.set('TrackRepository', new TrackRepository(Ioc.get('DatabaseFactory')));

        global.iocContainer.set('TrackFieldCreator', new TrackFieldCreator());

        global.iocContainer.set(
            'IndexablePathFetcher',
            new IndexablePathFetcher(Ioc.get('FolderRepository'), Ioc.get('DirectoryWalker'), Ioc.get('FileAccess'), Ioc.get('Logger')),
        );

        global.iocContainer.set(
            'TrackFiller',
            new TrackFiller(
                Ioc.get('FileMetadataFactory'),
                Ioc.get('AlbumKeyGenerator'),
                Ioc.get('TrackFieldCreator'),
                Ioc.get('MetadataPatcher'),
                Ioc.get('MimeTypes'),
                Ioc.get('FileAccess'),
                Ioc.get('DateTime'),
                Ioc.get('Logger'),
            ),
        );

        global.iocContainer.set(
            'CollectionChecker',
            new CollectionChecker(Ioc.get('TrackRepository'), Ioc.get('IndexablePathFetcher'), Ioc.get('Logger')),
        );

        global.iocContainer.set(
            'TrackUpdater',
            new TrackUpdater(
                Ioc.get('TrackRepository'),
                Ioc.get('TrackVerifier'),
                Ioc.get('TrackFiller'),
                Ioc.get('WorkerProxy'),
                Ioc.get('Logger'),
            ),
        );

        global.iocContainer.set(
            'TrackRemover',
            new TrackRemover(
                Ioc.get('FolderTrackRepository'),
                Ioc.get('TrackRepository'),
                Ioc.get('FileAccess'),
                Ioc.get('WorkerProxy'),
                Ioc.get('Logger'),
            ),
        );

        global.iocContainer.set(
            'TrackAdder',
            new TrackAdder(
                Ioc.get('RemovedTrackRepository'),
                Ioc.get('FolderTrackRepository'),
                Ioc.get('TrackRepository'),
                Ioc.get('IndexablePathFetcher'),
                Ioc.get('TrackFiller'),
                Ioc.get('WorkerProxy'),
                Ioc.get('Logger'),
            ),
        );

        global.iocContainer.set(
            'TrackIndexer',
            new TrackIndexer(
                Ioc.get('TrackAdder'),
                Ioc.get('TrackUpdater'),
                Ioc.get('TrackRemover'),
                Ioc.get('WorkerProxy'),
                Ioc.get('Logger'),
            ),
        );

        global.iocContainer.set(
            'Indexer',
            new Indexer(
                Ioc.get('CollectionChecker'),
                Ioc.get('TrackIndexer'),
                Ioc.get('TrackRepository'),
                Ioc.get('WorkerProxy'),
                Ioc.get('Logger'),
            ),
        );
    }

    static get(name) {
        return global.iocContainer.get(name);
    }
}

exports.Ioc = Ioc;
