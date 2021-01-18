import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IMock, Mock, Times } from 'typemoq';
import { AppComponent } from './app.component';
import { BaseRemoteProxy } from './core/io/base-remote-proxy';
import { RemoteProxyStub } from './core/io/remote-proxy-stub';
import { Logger } from './core/logger';
import { BaseSettings } from './core/settings/base-settings';
import { SettingsStub } from './core/settings/settings-stub';
import { AppearanceService } from './services/appearance/appearance.service';
import { BaseAppearanceService } from './services/appearance/base-appearance.service';
import { BaseNavigationService } from './services/navigation/base-navigation.service';
import { NavigationService } from './services/navigation/navigation.service';
import { BaseTranslatorService } from './services/translator/base-translator.service';
import { TranslatorService } from './services/translator/translator.service';

describe('AppComponent', () => {
    let app: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let navigationServiceMock: IMock<BaseNavigationService>;
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let loggerMock: IMock<Logger>;
    let appWithMocks: AppComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), RouterTestingModule],
            declarations: [AppComponent],
            providers: [
                { provide: BaseNavigationService, useClass: NavigationService },
                { provide: BaseAppearanceService, useClass: AppearanceService },
                { provide: BaseTranslatorService, useClass: TranslatorService },
                { provide: BaseSettings, useClass: SettingsStub },
                { provide: BaseRemoteProxy, useClass: RemoteProxyStub },
                Logger,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        app = fixture.componentInstance;
        fixture.detectChanges();

        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        loggerMock = Mock.ofType<Logger>();

        appWithMocks = new AppComponent(
            navigationServiceMock.object,
            appearanceServiceMock.object,
            translatorServiceMock.object,
            loggerMock.object
        );
    });

    it('should create', () => {
        expect(app).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should apply theme', () => {
            // Arrange

            // Act
            appWithMocks.ngOnInit();

            // Assert
            appearanceServiceMock.verify((x) => x.applyTheme(), Times.exactly(1));
        });

        it('should apply font size', () => {
            // Arrange

            // Act
            appWithMocks.ngOnInit();

            // Assert
            appearanceServiceMock.verify((x) => x.applyFontSize(), Times.exactly(1));
        });

        it('should apply language', () => {
            // Arrange

            // Act
            appWithMocks.ngOnInit();

            // Assert
            translatorServiceMock.verify((x) => x.applyLanguage(), Times.exactly(1));
        });
        it('should navigate to loading', () => {
            // Arrange

            // Act
            appWithMocks.ngOnInit();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToLoading(), Times.exactly(1));
        });
    });
});
