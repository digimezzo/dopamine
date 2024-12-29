const Database = require('better-sqlite3');

class DatabaseFactory {
    constructor(fileAccess, workerProxy) {
        this.fileAccess = fileAccess;
        this.workerProxy = workerProxy;
    }

    create() {
        const databaseFile = this.fileAccess.combinePath([this.workerProxy.applicationDataDirectory(), 'Dopamine.db']);

        return new Database(databaseFile);
    }
}

exports.DatabaseFactory = DatabaseFactory;
