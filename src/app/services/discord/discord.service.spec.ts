// import { IMock, Mock } from 'typemoq';
// import { BaseSettings } from '../../common/settings/base-settings';
// import { BasePlaybackService } from '../playback/base-playback.service';
// import { BaseTranslatorService } from '../translator/base-translator.service';
// import { DiscordService } from './discord.service';
// import { PresenceUpdater } from './presence-updater';

// describe('DiscordService', () => {
//     let playbackServiceMock: IMock<BasePlaybackService>;
//     let translatorServiceMock: IMock<BaseTranslatorService>;
//     let settingsMock: IMock<BaseSettings>;
//     let presenceUpdaterMock: IMock<PresenceUpdater>;

//     let service: DiscordService;

//     beforeEach(() => {
//         playbackServiceMock = Mock.ofType<BasePlaybackService>();
//         translatorServiceMock = Mock.ofType<BaseTranslatorService>();
//         settingsMock = Mock.ofType<BaseSettings>();
//         presenceUpdaterMock = Mock.ofType<PresenceUpdater>();

//         service = new DiscordService(
//             playbackServiceMock.object,
//             translatorServiceMock.object,
//             presenceUpdaterMock.object,
//             settingsMock.object
//         );
//     });

//     describe('constructor', () => {
//         it('should create', () => {
//             // Arrange

//             // Act

//             // Assert
//             expect(service).toBeDefined();
//         });
//     });
// });
