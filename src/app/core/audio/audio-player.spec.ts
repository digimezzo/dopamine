import { AudioPlayer } from './audio-player';

describe('AudioPlayer', () => {
    describe('genericTest', () => {
        it('should react to these commands', () => {
            const player: AudioPlayer = new AudioPlayer();
            player.play('C:\\Users\\rapha\\Music\\Aftersun\\17 - Aftersun (feat. Dot Allison).mp3');
        });
    });
});
