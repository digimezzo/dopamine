export class SensitiveInformation {
    public static readonly lastfmApiKey: string = process.env.LASTFM_API_KEY || '';
    public static readonly lastfmSharedSecret: string = process.env.LASTFM_SHARED_SECRET || '';
    public static readonly fanartApiKey: string = process.env.FANART_API_KEY || '';
}
