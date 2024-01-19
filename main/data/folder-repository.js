const { DatabaseFactory } = require('./database.factory');

class FolderRepository {
    static getFolders() {
        const database = DatabaseFactory.create();
        const statement = database.prepare(`SELECT FolderID as folderId, Path as path, ShowInCollection as showInCollection FROM Folder;`);

        return statement.all();
    }
}

exports.FolderRepository = FolderRepository;
