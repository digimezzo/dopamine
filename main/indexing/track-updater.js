const { Timer } = require('../common/timer');
const { TrackRepository } = require('../data/track-repository');
const { Logger } = require('../common/logger');
const { TrackVerifier } = require('./track-verifier');
const { TrackFiller } = require('./track-filler');

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

                        // if (numberOfUpdatedTracks === 1) {
                        //   // Only trigger the snack bar once
                        //   await this.snackBarService.updatingTracksAsync();
                        // }
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
