const { parentPort, workerData } = require('worker_threads');
const { IndexableTrack } = require('../src/app/services/indexing/indexable-track');
const { TrackFiller } = require('./track-filler');

const { arg } = workerData;

function performTaskAsync() {
    return TrackFiller.addFileMetadataToTracksAsync(arg.indexablePaths, arg.fillOnlyEssentialMetadata);
}

performTaskAsync().then((filledIndexableTracks) => {
    parentPort?.postMessage(filledIndexableTracks);
});
