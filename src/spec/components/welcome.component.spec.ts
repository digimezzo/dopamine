import { AppearanceService } from '../../app/services/appearance/appearance.service';
import * as assert from 'assert';
import * as TypeMoq from 'typemoq';
import { TranslatorService } from '../../app/services/translator/translator.service';
import { Router } from '@angular/router';
import { WelcomeComponent } from '../../app/components/welcome/welcome.component';

describe('WelcomeComponent', () => {
    describe('constructor', () => {
        it('Should start at step 0', () => {
            // Arrange
            const appearanceServiceMock = TypeMoq.Mock.ofType<AppearanceService>();
            const translatorServiceMock = TypeMoq.Mock.ofType<TranslatorService>();
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
            const appearanceServiceMock = TypeMoq.Mock.ofType<AppearanceService>();
            const translatorServiceMock = TypeMoq.Mock.ofType<TranslatorService>();
            const routerMock = TypeMoq.Mock.ofType<Router>();

            // Act
            const welcomeComponent: WelcomeComponent = new WelcomeComponent(
                routerMock.object,
                translatorServiceMock.object,
                appearanceServiceMock.object);

            // Assert
            assert.strictEqual(welcomeComponent.totalSteps, 6);
        });

        it('Cannot go back', () => {
            // Arrange
            const appearanceServiceMock = TypeMoq.Mock.ofType<AppearanceService>();
            const translatorServiceMock = TypeMoq.Mock.ofType<TranslatorService>();
            const routerMock = TypeMoq.Mock.ofType<Router>();

            // Act
            const welcomeComponent: WelcomeComponent = new WelcomeComponent(
                routerMock.object,
                 translatorServiceMock.object,
                 appearanceServiceMock.object);

            // Assert
            assert.strictEqual(welcomeComponent.canGoBack, false);
        });

        it('Can go forward', () => {
            // Arrange
            const appearanceServiceMock = TypeMoq.Mock.ofType<AppearanceService>();
            const translatorServiceMock = TypeMoq.Mock.ofType<TranslatorService>();
            const routerMock = TypeMoq.Mock.ofType<Router>();

            // Act
            const welcomeComponent: WelcomeComponent = new WelcomeComponent(
                routerMock.object,
                translatorServiceMock.object,
                appearanceServiceMock.object);

            // Assert
            assert.strictEqual(welcomeComponent.canGoForward, true);
        });

        it('Cannot finish', () => {
            // Arrange
            const appearanceServiceMock = TypeMoq.Mock.ofType<AppearanceService>();
            const translatorServiceMock = TypeMoq.Mock.ofType<TranslatorService>();
            const routerMock = TypeMoq.Mock.ofType<Router>();

            // Act
            const welcomeComponent: WelcomeComponent = new WelcomeComponent(
                routerMock.object,
                translatorServiceMock.object,
                appearanceServiceMock.object);

            // Assert
            assert.strictEqual(welcomeComponent.canFinish, false);
        });
    });
});
