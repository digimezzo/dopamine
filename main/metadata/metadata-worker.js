const { parentPort, workerData } = require('worker_threads');
const { MetadataAdder } = require('./metadata-adder');

const { arg } = workerData;

function performTaskAsync() {
    return MetadataAdder.addMetadataToIndexableTracksAsync(arg.indexableTracks, arg.fillOnlyEssentialMetadata);
}

performTaskAsync().then((filledIndexableTracks) => {
    parentPort?.postMessage(filledIndexableTracks);
});
