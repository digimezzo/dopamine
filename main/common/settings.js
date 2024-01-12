const Store = require('electron-store');

class Settings {
    static #store = new Store();

    static getSkipRemovedFilesDuringRefresh() {
        return this.#store.get('skipRemovedFilesDuringRefresh');
    }
}

exports.Settings = Settings;
