import { AudioPlayer } from '../app/core/audio/audio-player';

describe('AudioPlayer', () => {
    describe('genericTest', () => {
        it('Should react to these commands', () => {
           const player: AudioPlayer = new AudioPlayer();
           player.play('C:\\Users\\rapha\\Music\\Aftersun\\17 - Aftersun (feat. Dot Allison).mp3');
        });
    });
});
