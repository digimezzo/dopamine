const { Child } = require('./child');
const { Parent } = require('./parent');

global.iocContainer = new Map();

class Ioc {
    constructor() {}

    static registerAll() {
        global.iocContainer.set('Child', new Child());
        global.iocContainer.set('Parent', new Parent(Ioc.get('Child')));
    }

    static get(name) {
        return global.iocContainer.get(name);
    }
}

exports.Ioc = Ioc;
