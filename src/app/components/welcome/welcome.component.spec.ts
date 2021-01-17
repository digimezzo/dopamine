import assert from 'assert';
import { IMock, Mock, Times } from 'typemoq';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';
import { WelcomeComponent } from './welcome.component';

describe('WelcomeComponent', () => {
    let navigationServiceMock: IMock<BaseNavigationService>;
    let translatorService: IMock<BaseTranslatorService>;
    let appearanceService: IMock<BaseAppearanceService>;

    let component: WelcomeComponent;

    beforeEach(() => {
        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        translatorService = Mock.ofType<BaseTranslatorService>();
        appearanceService = Mock.ofType<BaseAppearanceService>();

        component = new WelcomeComponent(navigationServiceMock.object, translatorService.object, appearanceService.object);
    });
    describe('constructor', () => {
        it('should start at step 0', () => {
            // Arrange

            // Act

            // Assert
            assert.strictEqual(component.currentStep, 0);
        });

        it('should have 6 steps', () => {
            // Arrange

            // Act

            // Assert
            assert.strictEqual(component.totalSteps, 6);
        });

        it('Cannot go back', () => {
            // Arrange

            // Act

            // Assert
            assert.strictEqual(component.canGoBack, false);
        });

        it('Can go forward', () => {
            // Arrange

            // Act

            // Assert
            assert.strictEqual(component.canGoForward, true);
        });

        it('Cannot finish', () => {
            // Arrange

            // Act

            // Assert
            assert.strictEqual(component.canFinish, false);
        });

        it('should provide correct donate url', () => {
            // Arrange

            // Act

            // Assert
            assert.strictEqual(component.donateUrl, 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=MQALEWTEZ7HX8');
        });
    });
    describe('finish', () => {
        it('should navigate to loading component', async () => {
            // Arrange

            // Act
            component.finish();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToLoading(), Times.exactly(1));
        });
    });
});
