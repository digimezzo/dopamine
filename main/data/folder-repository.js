class FolderRepository {
    constructor(databaseFactory) {
        this.databaseFactory = databaseFactory;
    }

    getFolders() {
        const database = this.databaseFactory.create();
        const statement = database.prepare(`SELECT FolderID as folderId, Path as path, ShowInCollection as showInCollection FROM Folder;`);

        return statement.all();
    }
}

exports.FolderRepository = FolderRepository;
