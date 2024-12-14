class IndexablePath {
    constructor(path, dateModifiedTicks, folderId) {
        this.path = path;
        this.dateModifiedTicks = dateModifiedTicks;
        this.folderId = folderId;
    }
}

exports.IndexablePath = IndexablePath;
