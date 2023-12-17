import { IMock, Mock } from 'typemoq';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { WelcomeLanguageComponent } from './welcome-language.component';

describe('WelcomeLanguageComponent', () => {
    let translatorServiceMock: IMock<TranslatorServiceBase>;

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: WelcomeLanguageComponent = new WelcomeLanguageComponent(translatorServiceMock.object);

            // Assert
            expect(component).toBeDefined();
        });

        it('should define translatorService', () => {
            // Arrange
            const component: WelcomeLanguageComponent = new WelcomeLanguageComponent(translatorServiceMock.object);

            // Act, Assert
            expect(component.translatorService).toBeDefined();
        });
    });
});
