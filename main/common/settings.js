const Store = require('electron-store');

class Settings {
    #store = new Store();

    static getSkipRemovedFilesDuringRefresh() {
        return this.#store.get('skipRemovedFilesDuringRefresh');
    }
}

exports.Settings = Settings;
