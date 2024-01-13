const Database = require('better-sqlite3');
const { FileAccess } = require('../common/file-access');
const { workerData } = require('worker_threads');
const { arg } = workerData;

class DatabaseFactory {
    static create() {
        const databaseFile = FileAccess.combinePath([arg.applicationDataDirectory, 'Dopamine.db']);

        return new Database(databaseFile);
    }
}

exports.DatabaseFactory = DatabaseFactory;
