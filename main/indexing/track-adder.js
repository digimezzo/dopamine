const { Timer } = require('../common/scheduling/timer');
const { Track } = require('../data/entities/track');
const { FolderTrack } = require('../data/entities/folder-track');
const { AddingTracksMessage } = require('./messages/adding-tracks-message');
const { MathUtils } = require('../common/utils/math-utils');

class TrackAdder {
    constructor(removedTrackRepository, folderTrackRepository, trackRepository, indexablePathFetcher, trackFiller, workerProxy, logger) {
        this.removedTrackRepository = removedTrackRepository;
        this.folderTrackRepository = folderTrackRepository;
        this.trackRepository = trackRepository;
        this.indexablePathFetcher = indexablePathFetcher;
        this.trackFiller = trackFiller;
        this.workerProxy = workerProxy;
        this.logger = logger;
    }

    async addTracksThatAreNotInTheDatabaseAsync() {
        const timer = new Timer();
        timer.start();

        try {
            const indexablePaths = await this.#getIndexablePathsAsync(this.workerProxy.skipRemovedFilesDuringRefresh());

            let numberOfAddedTracks = 0;

            const loggedPercentages = new Set();

            for (let i = 0; i < indexablePaths.length; i++) {
                try {
                    const newTrack = new Track(indexablePaths[i].path);
                    this.trackFiller.addFileMetadataToTrack(newTrack, false);

                    this.trackRepository.addTrack(newTrack);
                    const addedTrack = this.trackRepository.getTrackByPath(newTrack.path);

                    this.folderTrackRepository.addFolderTrack(new FolderTrack(indexablePaths[i].folderId, addedTrack.trackId));

                    numberOfAddedTracks++;

                    const percentageOfAddedTracks = Math.round((numberOfAddedTracks / indexablePaths.length) * 100);
                    const percentageOfProcessedTracks = MathUtils.calculatePercentage(i + 1, indexablePaths.length);

                    if (
                        (percentageOfProcessedTracks % 20 === 0 || percentageOfProcessedTracks === 100) &&
                        !loggedPercentages.has(percentageOfProcessedTracks)
                    ) {
                        this.logger.info(`Processed ${i + 1} tracks`, 'TrackAdder', 'addTracksThatAreNotInTheDatabaseAsync');
                        loggedPercentages.add(percentageOfProcessedTracks);
                    }

                    // Only send message once every 20 tracks or when all tracks have been added
                    if (numberOfAddedTracks % 20 === 0 || percentageOfAddedTracks === 100) {
                        this.workerProxy.postMessage(new AddingTracksMessage(numberOfAddedTracks, percentageOfAddedTracks));
                    }
                } catch (e) {
                    this.logger.error(
                        e,
                        `A problem occurred while adding track with path='${indexablePaths[i].path}'`,
                        'TrackAdder',
                        'addTracksThatAreNotInTheDatabaseAsync',
                    );
                }
            }

            timer.stop();

            this.logger.info(
                `Added tracks: ${numberOfAddedTracks}. Time required: ${timer.getElapsedMilliseconds()} ms`,
                'TrackAdder',
                'addTracksThatAreNotInTheDatabaseAsync',
            );
        } catch (e) {
            timer.stop();

            this.logger.error(e, 'A problem occurred while adding tracks', 'TrackAdder', 'addTracksThatAreNotInTheDatabaseAsync');
        }
    }

    async #getIndexablePathsAsync(skipRemovedFiles) {
        const indexablePaths = [];

        const allIndexablePaths = await this.indexablePathFetcher.getIndexablePathsForAllFoldersAsync();
        const trackPaths = (this.trackRepository.getAllTracks() ?? []).map((x) => x.path);
        const removedTrackPaths = (this.removedTrackRepository.getRemovedTracks() ?? []).map((x) => x.path);

        for (const indexablePath of allIndexablePaths) {
            const isTrackInDatabase = trackPaths.includes(indexablePath.path);
            const isTrackThatWasPreviouslyRemoved = removedTrackPaths.includes(indexablePath.path);
            const allowReAddingRemovedTracks = !skipRemovedFiles;
            const isTrackThatWasPreviouslyRemovedAndCanBeReAdded = isTrackThatWasPreviouslyRemoved && allowReAddingRemovedTracks;

            if (!isTrackInDatabase) {
                if (!isTrackThatWasPreviouslyRemoved || isTrackThatWasPreviouslyRemovedAndCanBeReAdded) {
                    indexablePaths.push(indexablePath);
                }
            }
        }

        return indexablePaths;
    }
}

exports.TrackAdder = TrackAdder;
