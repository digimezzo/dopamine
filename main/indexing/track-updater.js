const { Timer } = require('../common/timer');
const { TrackRepository } = require('../data/track-repository');
const { Logger } = require('../common/logger');
const { TrackVerifier } = require('./track-verifier');
const { TrackFiller } = require('./track-filler');
const { parentPort } = require('worker_threads');
const { UpdatingTracksMessage } = require('./messages/updating-tracks-message');

class TrackUpdater {
    static async updateTracksThatAreOutOfDateAsync() {
        const timer = new Timer();
        timer.start();

        try {
            const tracks = TrackRepository.getAllTracks() ?? [];

            let numberOfUpdatedTracks = 0;

            for (const track of tracks) {
                try {
                    if (TrackVerifier.doesTrackNeedIndexing(track) || TrackVerifier.isTrackOutOfDate(track)) {
                        const filledTrack = await TrackFiller.addFileMetadataToTrack(track, false);
                        TrackRepository.updateTrack(filledTrack);
                        numberOfUpdatedTracks++;

                        // Only send message once
                        if (numberOfUpdatedTracks === 1) {
                            parentPort?.postMessage(new UpdatingTracksMessage());
                        }
                    }
                } catch (e) {
                    Logger.error(
                        e,
                        `A problem occurred while updating track with path='${track.path}'`,
                        'TrackUpdater',
                        'updateTracksThatAreOutOfDateAsync',
                    );
                }
            }

            timer.stop();

            Logger.info(
                `Updated tracks: ${numberOfUpdatedTracks}. Time required: ${timer.getElapsedMilliseconds()} ms`,
                'TrackUpdater',
                'updateTracksThatAreOutOfDateAsync',
            );
        } catch (e) {
            timer.stop();

            Logger.error(e, 'A problem occurred while updating tracks', 'TrackUpdater', 'updateTracksThatAreOutOfDateAsync');
        }
    }
}

exports.TrackUpdater = TrackUpdater;
