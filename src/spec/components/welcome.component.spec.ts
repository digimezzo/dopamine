import * as assert from 'assert';
import * as TypeMoq from 'typemoq';
import { Router } from '@angular/router';
import { WelcomeComponent } from '../../app/components/welcome/welcome.component';
import { Appearance } from '../../app/services/appearance/appearance';
import { Translator } from '../../app/services/translator/translator';

describe('WelcomeComponent', () => {
    describe('constructor', () => {
        it('Should start at step 0', () => {
            // Arrange
            const appearanceMock = TypeMoq.Mock.ofType<Appearance>();
            const translatorMock = TypeMoq.Mock.ofType<Translator>();
            const routerMock = TypeMoq.Mock.ofType<Router>();

            // Act
            const welcomeComponent: WelcomeComponent = new WelcomeComponent(
                routerMock.object,
                translatorMock.object,
                appearanceMock.object);

            // Assert
            assert.strictEqual(welcomeComponent.currentStep, 0);
        });

        it('Should have 6 steps', () => {
            // Arrange
            const appearanceMock = TypeMoq.Mock.ofType<Appearance>();
            const translatorMock = TypeMoq.Mock.ofType<Translator>();
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
            const appearanceMock = TypeMoq.Mock.ofType<Appearance>();
            const translatorMock = TypeMoq.Mock.ofType<Translator>();
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
            const appearanceMock = TypeMoq.Mock.ofType<Appearance>();
            const translatorMock = TypeMoq.Mock.ofType<Translator>();
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
            const appearanceMock = TypeMoq.Mock.ofType<Appearance>();
            const translatorMock = TypeMoq.Mock.ofType<Translator>();
            const routerMock = TypeMoq.Mock.ofType<Router>();

            // Act
            const welcomeComponent: WelcomeComponent = new WelcomeComponent(
                routerMock.object,
                translatorMock.object,
                appearanceMock.object);

            // Assert
            assert.strictEqual(welcomeComponent.canFinish, false);
        });
    });
});
