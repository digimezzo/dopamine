import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IMock, Mock } from 'typemoq';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';
import { WelcomeComponent } from './welcome.component';

describe('WelcomeComponent', () => {
    let navigationServiceMock: IMock<BaseNavigationService>;
    let translatorService: IMock<BaseTranslatorService>;
    let appearanceService: IMock<BaseAppearanceService>;
    let componentWithInjection: WelcomeComponent;

    let component: WelcomeComponent;
    let fixture: ComponentFixture<WelcomeComponent>;

    beforeEach(() => {
        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        translatorService = Mock.ofType<BaseTranslatorService>();
        appearanceService = Mock.ofType<BaseAppearanceService>();

        translatorService.setup((x) => x.languages).returns(() => []);

        componentWithInjection = new WelcomeComponent(navigationServiceMock.object, translatorService.object, appearanceService.object);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [WelcomeComponent],
            providers: [
                { provide: BaseNavigationService, useFactory: () => navigationServiceMock.object },
                { provide: BaseTranslatorService, useFactory: () => translatorService.object },
                { provide: BaseAppearanceService, useFactory: () => appearanceService.object },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WelcomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
