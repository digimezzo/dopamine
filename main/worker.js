const { parentPort, workerData } = require('worker_threads');
const { TrackFiller } = require('./track-filler');

const { arg } = workerData;

function performTaskAsync() {
    return TrackFiller.addFileMetadataToTracksAsync(arg.indexablePaths, arg.fillOnlyEssentialMetadata);
}

performTaskAsync().then((filledIndexableTracks) => {
    parentPort?.postMessage(filledIndexableTracks);
});
