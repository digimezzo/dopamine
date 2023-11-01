export class WebSearchResult {
    /**
     * Constructs an instance of WebSearchResult
     * @param fullUrl The full url to the lyrics in format "https://www.azlyrics.com/lyrics/massiveattack/teardrop.html"
     * @param domainUrl The domain url in format "www.azlyrics.com"
     */
    public constructor(
        public fullUrl: string,
        private domainUrl: string,
    ) {}

    public get name(): string {
        return this.domainUrl?.replace(/(www\.)?(.*)\.\w+$/g, '$2').toLowerCase();
    }
}
