const Database = require('better-sqlite3');
const { FileAccess } = require('../common/file-access');

class DatabaseFactory {
    static create() {
        const databaseFile = FileAccess.combinePath([FileAccess.applicationDataDirectory(), 'Dopamine.db']);

        return new Database(databaseFile);
    }
}

exports.DatabaseFactory = DatabaseFactory;
