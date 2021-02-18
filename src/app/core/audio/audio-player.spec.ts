import { AudioPlayer } from './audio-player';

describe('AudioPlayer', () => {
    describe('genericTest', () => {
        it('should react to these commands', () => {
            const player: AudioPlayer = new AudioPlayer();
            player.play('/home/raphael/Music/01 - Going Under.mp3');
        });
    });
});
