import { IAudioPlayer } from './i-audio-player';
import { LegacyAudioPlayer } from './legacy-audio-player';
import { Injectable } from '@angular/core';
import { MathExtensions } from '../../../common/math-extensions';
import { Logger } from '../../../common/logger';
import { SettingsBase } from '../../../common/settings/settings.base';
import { GaplessAudioPlayer } from './gapless-audio-player';
import { CrossfadeAudioPlayer } from './crossfade-audio-player';
import { EqualizerServiceBase } from '../../equalizer/equalizer.service.base';

@Injectable({ providedIn: 'root' })
export class AudioPlayerFactory {
    public constructor(
        private mathExtensions: MathExtensions,
        private settings: SettingsBase,
        private equalizerService: EqualizerServiceBase,
        private logger: Logger,
    ) {}

    public create(): IAudioPlayer {
        if (this.settings.useCrossfade) {
            this.logger.info('Creating CrossfadeAudioPlayer for audio playback.', 'AudioPlayerFactory', 'create');
            return new CrossfadeAudioPlayer(this.mathExtensions, this.settings, this.equalizerService, this.logger);
        } else if (this.settings.useGaplessPlayback) {
            this.logger.info('Creating GaplessAudioPlayer for audio playback.', 'AudioPlayerFactory', 'create');
            return new GaplessAudioPlayer(this.mathExtensions, this.equalizerService, this.logger);
        } else {
            this.logger.info('Creating LegacyAudioPlayer for audio playback.', 'AudioPlayerFactory', 'create');
            return new LegacyAudioPlayer(this.mathExtensions, this.equalizerService, this.logger);
        }
    }
}
