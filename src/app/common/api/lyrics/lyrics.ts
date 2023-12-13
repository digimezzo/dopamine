export class Lyrics {
    public constructor(
        public sourceName: string,
        public text: string,
    ) {}

    public static empty(): Lyrics {
        return new Lyrics('', '');
    }
}
