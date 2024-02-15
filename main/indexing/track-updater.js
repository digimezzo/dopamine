const { UpdatingTracksMessage } = require('./messages/updating-tracks-message');
const { Timer } = require('../common/scheduling/timer');

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

            for (const track of tracks) {
                try {
                    if (this.trackVerifier.doesTrackNeedIndexing(track) || this.trackVerifier.isTrackOutOfDate(track)) {
                        const filledTrack = await this.trackFiller.addFileMetadataToTrack(track, false);
                        this.trackRepository.updateTrack(filledTrack);
                        numberOfUpdatedTracks++;

                        // Only send message once
                        if (numberOfUpdatedTracks === 1) {
                            this.workerProxy.postMessage(new UpdatingTracksMessage());
                        }
                    }
                } catch (e) {
                    this.logger.error(
                        e,
                        `A problem occurred while updating track with path='${track.path}'`,
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
