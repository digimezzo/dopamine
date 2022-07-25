import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseSettings } from '../../../common/settings/base-settings';
import { BaseDiscordService } from '../../../services/discord/base-discord.service';

@Component({
    selector: 'app-online-settings',
    host: { style: 'display: block' },
    templateUrl: './online-settings.component.html',
    styleUrls: ['./online-settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class OnlineSettingsComponent implements OnInit {
    constructor(public discordService: BaseDiscordService, private settings: BaseSettings) {}

    public get enableDiscordRichPresence(): boolean {
        return this.settings.enableDiscordRichPresence;
    }

    public set enableDiscordRichPresence(v: boolean) {
        this.settings.enableDiscordRichPresence = v;
        this.discordService.setRichPresence(v);
    }

    public ngOnInit(): void {}
}
