import { PresenceArgs } from './presence-args';
import { DiscordApiCommandType } from './discord-api-command-type';

export class DiscordApiCommand {
    public constructor(
        public commandType: DiscordApiCommandType,
        public args: PresenceArgs | undefined,
    ) {}
}
