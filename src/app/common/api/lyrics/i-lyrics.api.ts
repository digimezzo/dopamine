import { Lyrics } from './lyrics';

export interface ILyricsApi {
    readonly sourceName: string;
    getLyricsAsync(artist: string, title: string): Promise<Lyrics>;
}
