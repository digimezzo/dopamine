import { IAudioPlayer } from './i-audio-player';
import { AudioPlayer } from './audio-player';
import { Injectable } from '@angular/core';
import { MathExtensions } from '../../../common/math-extensions';
import { Logger } from '../../../common/logger';
import { SettingsBase } from '../../../common/settings/settings.base';

@Injectable({ providedIn: 'root' })
export class AudioPlayerFactory {
    public constructor(
        private mathExtensions: MathExtensions,
        private settings: SettingsBase,
        private logger: Logger,
    ) {}

    public create(): IAudioPlayer {
        if (this.settings.useGaplessPlayback) {
            return new AudioPlayer(this.mathExtensions, this.logger);
        } else {
            return new AudioPlayer(this.mathExtensions, this.logger);
        }
    }
}
