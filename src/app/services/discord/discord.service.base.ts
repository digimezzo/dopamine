export abstract class DiscordServiceBase {
    public abstract setRichPresenceFromSettings(): void;
    public abstract setRichPresence(enableRichPresence: boolean): void;
}
