import * as assert from 'assert';
import * as TypeMoq from 'typemoq';
import { Router } from '@angular/router';
import { WelcomeComponent } from '../../app/components/welcome/welcome.component';
import { BaseAppearanceService } from '../../app/services/appearance/base-appearance.service';
import { BaseTranslatorService } from '../../app/services/translator/base-translator.service';

describe('WelcomeComponent', () => {
    describe('constructor', () => {
        it('Should start at step 0', () => {
            // Arrange
            const appearanceServiceMock = TypeMoq.Mock.ofType<BaseAppearanceService>();
            const translatorServiceMock = TypeMoq.Mock.ofType<BaseTranslatorService>();
            const routerMock = TypeMoq.Mock.ofType<Router>();

            // Act
            const welcomeComponent: WelcomeComponent = new WelcomeComponent(
                routerMock.object,
                translatorServiceMock.object,
                appearanceServiceMock.object);

            // Assert
            assert.strictEqual(welcomeComponent.currentStep, 0);
        });

        it('Should have 6 steps', () => {
            // Arrange
            const appearanceMock = TypeMoq.Mock.ofType<BaseAppearanceService>();
            const translatorMock = TypeMoq.Mock.ofType<BaseTranslatorService>();
            const routerMock = TypeMoq.Mock.ofType<Router>();

            // Act
            const welcomeComponent: WelcomeComponent = new WelcomeComponent(
                routerMock.object,
                translatorMock.object,
                appearanceMock.object);

            // Assert
            assert.strictEqual(welcomeComponent.totalSteps, 6);
        });

        it('Cannot go back', () => {
            // Arrange
            const appearanceMock = TypeMoq.Mock.ofType<BaseAppearanceService>();
            const translatorMock = TypeMoq.Mock.ofType<BaseTranslatorService>();
            const routerMock = TypeMoq.Mock.ofType<Router>();

            // Act
            const welcomeComponent: WelcomeComponent = new WelcomeComponent(
                routerMock.object,
                translatorMock.object,
                 appearanceMock.object);

            // Assert
            assert.strictEqual(welcomeComponent.canGoBack, false);
        });

        it('Can go forward', () => {
            // Arrange
            const appearanceMock = TypeMoq.Mock.ofType<BaseAppearanceService>();
            const translatorMock = TypeMoq.Mock.ofType<BaseTranslatorService>();
            const routerMock = TypeMoq.Mock.ofType<Router>();

            // Act
            const welcomeComponent: WelcomeComponent = new WelcomeComponent(
                routerMock.object,
                translatorMock.object,
                appearanceMock.object);

            // Assert
            assert.strictEqual(welcomeComponent.canGoForward, true);
        });

        it('Cannot finish', () => {
            // Arrange
            const appearanceMock = TypeMoq.Mock.ofType<BaseAppearanceService>();
            const translatorMock = TypeMoq.Mock.ofType<BaseTranslatorService>();
            const routerMock = TypeMoq.Mock.ofType<Router>();

            // Act
            const welcomeComponent: WelcomeComponent = new WelcomeComponent(
                routerMock.object,
                translatorMock.object,
                appearanceMock.object);

            // Assert
            assert.strictEqual(welcomeComponent.canFinish, false);
        });

        it('Should provide correct donate url', () => {
            // Arrange
            const appearanceMock = TypeMoq.Mock.ofType<BaseAppearanceService>();
            const translatorMock = TypeMoq.Mock.ofType<BaseTranslatorService>();
            const routerMock = TypeMoq.Mock.ofType<Router>();

            // Act
            const welcomeComponent: WelcomeComponent = new WelcomeComponent(
                routerMock.object,
                translatorMock.object,
                appearanceMock.object);

            // Assert
            assert.strictEqual(
                welcomeComponent.donateUrl,
                'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=MQALEWTEZ7HX8');
        });
    });
});
