const { UpdatingTracksMessage } = require('./messages/updating-tracks-message');
const { Timer } = require('../common/scheduling/timer');
const { MathUtils } = require('../common/utils/math-utils');

class TrackUpdater {
    constructor(trackRepository, trackVerifier, trackFiller, workerProxy, logger) {
        this.trackRepository = trackRepository;
        this.trackVerifier = trackVerifier;
        this.trackFiller = trackFiller;
        this.workerProxy = workerProxy;
        this.logger = logger;
    }

    async updateTracksThatAreOutOfDateAsync() {
        const timer = new Timer();
        timer.start();

        try {
            const tracks = this.trackRepository.getAllTracks() ?? [];

            let numberOfUpdatedTracks = 0;

            const loggedPercentages = new Set();

            for (let i = 0; i < tracks.length; i++) {
                try {
                    if (this.trackVerifier.doesTrackNeedIndexing(tracks[i]) || this.trackVerifier.isTrackOutOfDate(tracks[i])) {
                        const filledTrack = await this.trackFiller.addFileMetadataToTrack(tracks[i], false);
                        this.trackRepository.updateTrack(filledTrack);
                        numberOfUpdatedTracks++;

                        const percentageOfProcessedTracks = MathUtils.calculatePercentage(i + 1, tracks.length);

                        if (
                            (percentageOfProcessedTracks % 20 === 0 || percentageOfProcessedTracks === 100) &&
                            !loggedPercentages.has(percentageOfProcessedTracks)
                        ) {
                            this.logger.info(`Processed ${i + 1} tracks`, 'TrackUpdater', 'updateTracksThatAreOutOfDateAsync');
                            loggedPercentages.add(percentageOfProcessedTracks);
                        }

                        // Only send message once
                        if (numberOfUpdatedTracks === 1) {
                            this.workerProxy.postMessage(new UpdatingTracksMessage());
                        }
                    }
                } catch (e) {
                    this.logger.error(
                        e,
                        `A problem occurred while updating track with path='${tracks[i].path}'`,
                        'TrackUpdater',
                        'updateTracksThatAreOutOfDateAsync',
                    );
                }
            }

            timer.stop();

            this.logger.info(
                `Updated tracks: ${numberOfUpdatedTracks}. Time required: ${timer.getElapsedMilliseconds()} ms`,
                'TrackUpdater',
                'updateTracksThatAreOutOfDateAsync',
            );
        } catch (e) {
            timer.stop();

            this.logger.error(e, 'A problem occurred while updating tracks', 'TrackUpdater', 'updateTracksThatAreOutOfDateAsync');
        }
    }
}

exports.TrackUpdater = TrackUpdater;
