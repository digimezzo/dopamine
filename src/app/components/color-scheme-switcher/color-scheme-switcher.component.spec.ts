import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { IMock, Mock } from 'typemoq';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { ColorSchemeSwitcherComponent } from './color-scheme-switcher.component';

describe('ColorSchemeSwitcherComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();

    let componentWithInjection: ColorSchemeSwitcherComponent;

    let component: ColorSchemeSwitcherComponent;
    let fixture: ComponentFixture<ColorSchemeSwitcherComponent>;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        appearanceServiceMock.setup((x) => x.colorSchemes).returns(() => []);

        componentWithInjection = new ColorSchemeSwitcherComponent(appearanceServiceMock.object);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), MatTooltipModule],
            declarations: [ColorSchemeSwitcherComponent],
            providers: [{ provide: BaseAppearanceService, useFactory: () => appearanceServiceMock.object }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorSchemeSwitcherComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
