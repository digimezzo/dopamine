import { StringUtils } from './string-utils';

export class PathUtils {
    public static createPlayableAudioFilePath(audioFilePath: string): string {
        // HTMLAudioElement doesn't play paths which contain # and ?, so we escape them.
        let playableAudioFilePath: string = StringUtils.replaceAll(audioFilePath, '#', '%23');
        playableAudioFilePath = StringUtils.replaceAll(playableAudioFilePath, '?', '%3F');

        return `file:///${playableAudioFilePath}`;
    }
}
