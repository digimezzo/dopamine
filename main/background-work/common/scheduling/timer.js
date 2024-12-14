const moment = require('moment');

class Timer {
    #startedMilliseconds;
    #stoppedMilliseconds;

    getElapsedMilliseconds() {
        return this.#stoppedMilliseconds - this.#startedMilliseconds;
    }

    start() {
        this.#startedMilliseconds = moment().valueOf();
    }

    stop() {
        this.#stoppedMilliseconds = moment().valueOf();
    }
}

exports.Timer = Timer;
