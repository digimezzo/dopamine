const Database = require('better-sqlite3');
const { FileAccess } = require('../common/io/file-access');
const { WorkerProxy } = require('../workers/worker-proxy');

class DatabaseFactory {
    static create() {
        const databaseFile = FileAccess.combinePath([WorkerProxy.applicationDataDirectory(), 'Dopamine.db']);

        return new Database(databaseFile);
    }
}

exports.DatabaseFactory = DatabaseFactory;
