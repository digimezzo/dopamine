const uuid = require('uuid');

class GuidFactory {
    static create() {
        return uuid.v4();
    }
}
exports.GuidFactory = GuidFactory;
