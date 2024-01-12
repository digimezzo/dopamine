const { Settings } = require('../common/settings');
const { Timer } = require('../common/timer');
const { TrackFiller } = require('./track-filler');
const { Logger } = require('../common/logger');
const { IndexablePathFetcher } = require('./indexable-path-fetcher');
const { TrackRepository } = require('../data/track-repository');
const { Track } = require('../data/entities/track');
const { FolderTrackRepository } = require('../data/folder-track-repository');
const { RemovedTrackRepository } = require('../data/removed-track-repository');

class TrackAdder {
    static async addTracksThatAreNotInTheDatabaseAsync() {
        const timer = new Timer();
        timer.start();

        try {
            const indexablePaths = await this.#getIndexablePathsAsync(Settings.getSkipRemovedFilesDuringRefresh());

            let numberOfAddedTracks = 0;

            for (const indexablePath of indexablePaths) {
                try {
                    const newTrack = new Track(indexablePath.path);
                    TrackFiller.addFileMetadataToTrack(newTrack, false);

                    TrackRepository.addTrack(newTrack);
                    const addedTrack = TrackRepository.getTrackByPath(newTrack.path);

                    FolderTrackRepository.addFolderTrack(new FolderTrack(indexablePath.folderId, addedTrack.trackId));

                    numberOfAddedTracks++;

                    // const percentageOfAddedTracks = Math.round((numberOfAddedTracks / indexablePaths.length) * 100);
                    // await this.snackBarService.addedTracksAsync(numberOfAddedTracks, percentageOfAddedTracks);
                } catch (e) {
                    Logger.error(
                        e,
                        `A problem occurred while adding track with path='${indexablePath.path}'`,
                        'TrackAdder',
                        'addTracksThatAreNotInTheDatabaseAsync',
                    );
                }
            }

            timer.stop();

            Logger.info(
                `Added tracks: ${numberOfAddedTracks}. Time required: ${timer.getElapsedMilliseconds()} ms`,
                'TrackAdder',
                'addTracksThatAreNotInTheDatabaseAsync',
            );
        } catch (e) {
            timer.stop();

            Logger.error(e, 'A problem occurred while adding tracks', 'TrackAdder', 'addTracksThatAreNotInTheDatabaseAsync');
        }
    }

    async #getIndexablePathsAsync(skipRemovedFiles) {
        const indexablePaths = [];

        const allIndexablePaths = await IndexablePathFetcher.getIndexablePathsForAllFoldersAsync();
        const trackPaths = (TrackRepository.getAllTracks() ?? []).map((x) => x.path);
        const removedTrackPaths = (RemovedTrackRepository.getRemovedTracks() ?? []).map((x) => x.path);

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
