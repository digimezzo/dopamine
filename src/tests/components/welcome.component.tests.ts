import { AppearanceService } from '../../app/services/appearance/appearance.service';
import * as assert from 'assert';
import * as TypeMoq from "typemoq";
import { TranslatorService } from '../../app/services/translator/translator.service';
import { Router } from '@angular/router';
import { WelcomeComponent } from '../../app/components/welcome/welcome.component';

describe('WelcomeComponent', () => {
    describe('constructor', () => {
        it('Should start at step 0', () => {
            // Arrange
            var appearanceServiceMock = TypeMoq.Mock.ofType<AppearanceService>();
            var translatorServiceMock = TypeMoq.Mock.ofType<TranslatorService>();
            var routerMock = TypeMoq.Mock.ofType<Router>();

            // Act
            let welcomeComponent: WelcomeComponent = new WelcomeComponent(routerMock.object, translatorServiceMock.object, appearanceServiceMock.object);

            // Assert
            assert.equal(welcomeComponent.currentStep, 0);
        });

        it('Should have 6 steps', () => {
            // Arrange
            var appearanceServiceMock = TypeMoq.Mock.ofType<AppearanceService>();
            var translatorServiceMock = TypeMoq.Mock.ofType<TranslatorService>();
            var routerMock = TypeMoq.Mock.ofType<Router>();

            // Act
            let welcomeComponent: WelcomeComponent = new WelcomeComponent(routerMock.object, translatorServiceMock.object, appearanceServiceMock.object);

            // Assert
            assert.equal(welcomeComponent.totalSteps, 6);
        });

        it('Cannot go back', () => {
            // Arrange
            var appearanceServiceMock = TypeMoq.Mock.ofType<AppearanceService>();
            var translatorServiceMock = TypeMoq.Mock.ofType<TranslatorService>();
            var routerMock = TypeMoq.Mock.ofType<Router>();

            // Act
            let welcomeComponent: WelcomeComponent = new WelcomeComponent(routerMock.object, translatorServiceMock.object, appearanceServiceMock.object);

            // Assert
            assert.equal(welcomeComponent.canGoBack, false);
        });

        it('Can go forward', () => {
            // Arrange
            var appearanceServiceMock = TypeMoq.Mock.ofType<AppearanceService>();
            var translatorServiceMock = TypeMoq.Mock.ofType<TranslatorService>();
            var routerMock = TypeMoq.Mock.ofType<Router>();

            // Act
            let welcomeComponent: WelcomeComponent = new WelcomeComponent(routerMock.object, translatorServiceMock.object, appearanceServiceMock.object);

            // Assert
            assert.equal(welcomeComponent.canGoForward, true);
        });

        it('Cannot finish', () => {
            // Arrange
            var appearanceServiceMock = TypeMoq.Mock.ofType<AppearanceService>();
            var translatorServiceMock = TypeMoq.Mock.ofType<TranslatorService>();
            var routerMock = TypeMoq.Mock.ofType<Router>();

            // Act
            let welcomeComponent: WelcomeComponent = new WelcomeComponent(routerMock.object, translatorServiceMock.object, appearanceServiceMock.object);

            // Assert
            assert.equal(welcomeComponent.canFinish, false);
        });
    });
});