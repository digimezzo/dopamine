import * as assert from 'assert';
import * as TypeMoq from 'typemoq';
import { Router } from '@angular/router';
import { WelcomeComponent } from '../../app/components/welcome/welcome.component';
import { AppearanceServiceBase } from '../../app/services/appearance/appearance-service-base';
import { TranslatorServiceBase } from '../../app/services/translator/translator-service-base';

describe('WelcomeComponent', () => {
    describe('constructor', () => {
        it('Should start at step 0', () => {
            // Arrange
            const appearanceServiceMock = TypeMoq.Mock.ofType<AppearanceServiceBase>();
            const translatorServiceMock = TypeMoq.Mock.ofType<TranslatorServiceBase>();
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
            const appearanceMock = TypeMoq.Mock.ofType<AppearanceServiceBase>();
            const translatorMock = TypeMoq.Mock.ofType<TranslatorServiceBase>();
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
            const appearanceMock = TypeMoq.Mock.ofType<AppearanceServiceBase>();
            const translatorMock = TypeMoq.Mock.ofType<TranslatorServiceBase>();
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
            const appearanceMock = TypeMoq.Mock.ofType<AppearanceServiceBase>();
            const translatorMock = TypeMoq.Mock.ofType<TranslatorServiceBase>();
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
            const appearanceMock = TypeMoq.Mock.ofType<AppearanceServiceBase>();
            const translatorMock = TypeMoq.Mock.ofType<TranslatorServiceBase>();
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
            const appearanceMock = TypeMoq.Mock.ofType<AppearanceServiceBase>();
            const translatorMock = TypeMoq.Mock.ofType<TranslatorServiceBase>();
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
