import { IMock, Mock, Times } from 'typemoq';
import { BaseDiscordService } from '../../../services/discord/base-discord.service';
import { OnlineSettingsComponent } from './online-settings.component';

describe('OnlineSettingsComponent', () => {
    let discordServiceMock: IMock<BaseDiscordService>;
    let settingsStub: any;

    let component: OnlineSettingsComponent;

    beforeEach(() => {
        discordServiceMock = Mock.ofType<BaseDiscordService>();
        settingsStub = { enableDiscordRichPresence: true };

        component = new OnlineSettingsComponent(discordServiceMock.object, settingsStub);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });
    });

    describe('enableDiscordRichPresence', () => {
        it('should save enableDiscordRichPresence to the settings', () => {
            // Arrange

            // Act
            component.enableDiscordRichPresence = false;

            // Assert
            expect(settingsStub.enableDiscordRichPresence).toBeFalsy();
        });

        it('should get enableDiscordRichPresence from the settings', () => {
            // Arrange

            // Act
            const enableDiscordRichPresenceFromSettings: boolean = component.enableDiscordRichPresence;

            // Assert
            expect(enableDiscordRichPresenceFromSettings).toBeTruthy();
        });

        it('should set Discord Rich Presence to true when true', () => {
            // Arrange

            // Act
            component.enableDiscordRichPresence = true;

            // Assert
            discordServiceMock.verify((x) => x.setRichPresence(true), Times.exactly(1));
        });

        it('should set Discord Rich Presence to false when false', () => {
            // Arrange

            // Act
            component.enableDiscordRichPresence = false;

            // Assert
            discordServiceMock.verify((x) => x.setRichPresence(false), Times.exactly(1));
        });
    });
});
