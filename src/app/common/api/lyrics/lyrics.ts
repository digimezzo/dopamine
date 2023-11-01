export class Lyrics {
    public constructor(
        public sourceName: string,
        public text: string,
    ) {}

    public static default(): Lyrics {
        return new Lyrics('', '');
    }
}
