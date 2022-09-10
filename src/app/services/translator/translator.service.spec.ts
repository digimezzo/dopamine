import { Subscription } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { Constants } from '../../common/application/constants';
import { Language } from '../../common/application/language';
import { BaseTranslateServiceProxy } from '../../common/io/base-translate-service-proxy';
import { BaseSettings } from '../../common/settings/base-settings';
import { TranslatorService } from './translator.service';

describe('TranslatorService', () => {
    let translateServiceProxyMock: IMock<BaseTranslateServiceProxy>;
    let settingsMock: IMock<BaseSettings>;

    beforeEach(() => {
        translateServiceProxyMock = Mock.ofType<BaseTranslateServiceProxy>();
        translateServiceProxyMock.setup((x) => x.get('welcome-to-dopamine', undefined)).returns(async () => 'Welcome to Dopamine');
        translateServiceProxyMock.setup((x) => x.instant('welcome-to-dopamine', undefined)).returns(() => 'Welcome to Dopamine');
        translateServiceProxyMock
            .setup((x) =>
                x.get('tracks-added', {
                    numberOfAddedTracks: 3,
                })
            )
            .returns(async () => '3 tracks added');
        translateServiceProxyMock
            .setup((x) =>
                x.instant('tracks-added', {
                    numberOfAddedTracks: 3,
                })
            )
            .returns(() => '3 tracks added');

        settingsMock = Mock.ofType<BaseSettings>();
        settingsMock.setup((x) => x.defaultLanguage).returns(() => 'en');
        settingsMock.setup((x) => x.language).returns(() => 'fr');
    });

    const flushPromises = () => new Promise(process.nextTick);

    function createService(): TranslatorService {
        return new TranslatorService(translateServiceProxyMock.object, settingsMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const service: TranslatorService = createService();

            // Assert
            expect(service).toBeDefined();
        });

        it('should define languageChanged$', () => {
            // Arrange

            // Act
            const service: TranslatorService = createService();

            // Assert
            expect(service.languageChanged$).toBeDefined();
        });

        it('should set the default language', () => {
            // Arrange

            // Act
            const service: TranslatorService = createService();

            // Assert
            translateServiceProxyMock.verify((x) => x.setDefaultLang('en'), Times.once());
        });

        it('should set languages from constants', () => {
            // Arrange

            // Act
            const service: TranslatorService = createService();

            // Assert
            expect(service.languages).toEqual(Constants.languages);
        });
    });

    describe('selectedLanguage', () => {
        it('should return the language that corresponds to language code in settings', () => {
            // Arrange
            const expectedLanguage: Language = Constants.languages.find((x) => x.code === 'fr');
            const service: TranslatorService = createService();

            // Act
            const returnedLanguage: Language = service.selectedLanguage;

            // Assert
            expect(returnedLanguage).toEqual(expectedLanguage);
        });

        it('should save selected language to settings', () => {
            // Arrange
            const settingsStub: any = { defaultLanguage: 'en', language: 'fr' };
            const service: TranslatorService = new TranslatorService(translateServiceProxyMock.object, settingsStub);
            const germanLanguage: Language = new Language('de', 'German', 'Deutch', false);

            // Act
            service.selectedLanguage = germanLanguage;

            // Assert
            expect(settingsStub.language).toEqual('de');
        });

        it('should apply language from settings', () => {
            // Arrange
            const settingsStub: any = { defaultLanguage: 'en', language: 'fr' };
            const service: TranslatorService = new TranslatorService(translateServiceProxyMock.object, settingsStub);
            const germanLanguage: Language = new Language('de', 'German', 'Deutch', false);

            // Act
            service.selectedLanguage = germanLanguage;

            // Assert
            translateServiceProxyMock.verify((x) => x.use('de'), Times.once());
        });

        it('should notify that language has changed', async () => {
            // Arrange
            const settingsStub: any = { defaultLanguage: 'en', language: 'fr' };
            const service: TranslatorService = new TranslatorService(translateServiceProxyMock.object, settingsStub);
            const germanLanguage: Language = new Language('de', 'German', 'Deutch', false);

            const subscription: Subscription = new Subscription();
            let languageChangedReceived: boolean = false;

            subscription.add(
                service.languageChanged$.subscribe(() => {
                    languageChangedReceived = true;
                })
            );

            // Act
            service.selectedLanguage = germanLanguage;
            await flushPromises();

            // Assert
            expect(languageChangedReceived).toBeTruthy();
        });
    });

    describe('getAsync', () => {
        it('should get language text when no parameters are specified', async () => {
            // Arrange
            const service: TranslatorService = createService();

            // Act
            const translatedText: string = await service.getAsync('welcome-to-dopamine');

            // Assert
            expect(translatedText).toEqual('Welcome to Dopamine');
        });

        it('should get language text when parameters are specified', async () => {
            // Arrange
            const service: TranslatorService = createService();

            // Act
            const translatedText: string = await service.getAsync('tracks-added', {
                numberOfAddedTracks: 3,
            });

            // Assert
            expect(translatedText).toEqual('3 tracks added');
        });
    });

    describe('get', () => {
        it('should get language text when no parameters are specified', () => {
            // Arrange
            const service: TranslatorService = createService();

            // Act
            const translatedText: string = service.get('welcome-to-dopamine');

            // Assert
            expect(translatedText).toEqual('Welcome to Dopamine');
        });

        it('should get language text when parameters are specified', () => {
            // Arrange
            const service: TranslatorService = createService();

            // Act
            const translatedText: string = service.get('tracks-added', {
                numberOfAddedTracks: 3,
            });

            // Assert
            expect(translatedText).toEqual('3 tracks added');
        });
    });
});
