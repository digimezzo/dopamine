const { parentPort, workerData } = require('worker_threads');
const { MetadataAdder } = require('./metadata-adder');

const { arg } = workerData;

function performTaskAsync() {
    return MetadataAdder.addMetadataToTracksAsync(arg.tracks, arg.fillOnlyEssentialMetadata);
}

performTaskAsync().then((filledTracks) => {
    parentPort?.postMessage(filledTracks);
});
