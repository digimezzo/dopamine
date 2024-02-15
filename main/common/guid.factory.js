const uuid = require('uuid');

class GuidFactory {
    create() {
        return uuid.v4();
    }
}
exports.GuidFactory = GuidFactory;
