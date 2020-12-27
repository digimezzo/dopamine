import * as assert from 'assert';
import { Times } from 'typemoq';
import { WelcomeComponentMocker } from './mocking/welcome-component-mocker';

describe('WelcomeComponent', () => {
    describe('constructor', () => {
        it('Should start at step 0', () => {
            // Arrange

            // Act
            const mocker: WelcomeComponentMocker = new WelcomeComponentMocker();

            // Assert
            assert.strictEqual(mocker.welcomeComponent.currentStep, 0);
        });

        it('Should have 6 steps', () => {
            // Arrange

            // Act
            const mocker: WelcomeComponentMocker = new WelcomeComponentMocker();

            // Assert
            assert.strictEqual(mocker.welcomeComponent.totalSteps, 6);
        });

        it('Cannot go back', () => {
            // Arrange

            // Act
            const mocker: WelcomeComponentMocker = new WelcomeComponentMocker();

            // Assert
            assert.strictEqual(mocker.welcomeComponent.canGoBack, false);
        });

        it('Can go forward', () => {
            // Arrange

            // Act
            const mocker: WelcomeComponentMocker = new WelcomeComponentMocker();

            // Assert
            assert.strictEqual(mocker.welcomeComponent.canGoForward, true);
        });

        it('Cannot finish', () => {
            // Arrange

            // Act
            const mocker: WelcomeComponentMocker = new WelcomeComponentMocker();

            // Assert
            assert.strictEqual(mocker.welcomeComponent.canFinish, false);
        });

        it('Should provide correct donate url', () => {
            // Arrange

            // Act
            const mocker: WelcomeComponentMocker = new WelcomeComponentMocker();

            // Assert
            assert.strictEqual(
                mocker.welcomeComponent.donateUrl,
                'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=MQALEWTEZ7HX8');
        });
    });
    describe('finish', () => {
        it('Should navigate to loading component', async () => {
            // Arrange
            const mocker: WelcomeComponentMocker = new WelcomeComponentMocker();

            // Act
            mocker.welcomeComponent.finish();

            // Assert
            mocker.navigationServiceMock.verify(x => x.navigateToLoading(), Times.exactly(1));
        });
    });
});
