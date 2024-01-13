class AddingTracksMessage {
    constructor(numberOfAddedTracks, percentageOfAddedTracks) {
        this.type = 'addingTracks';
        this.numberOfAddedTracks = numberOfAddedTracks;
        this.percentageOfAddedTracks = percentageOfAddedTracks;
    }
}

exports.AddingTracksMessage = AddingTracksMessage;