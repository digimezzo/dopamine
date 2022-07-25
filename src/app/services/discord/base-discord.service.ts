export abstract class BaseDiscordService {
    public abstract setRichPresenceFromSettings(): void;
    public abstract setRichPresence(enableRichPresence: boolean): void;
}
