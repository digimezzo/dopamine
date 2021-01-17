import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let componentWithInjection: SettingsComponent;

    let component: SettingsComponent;
    let fixture: ComponentFixture<SettingsComponent>;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        componentWithInjection = new SettingsComponent(appearanceServiceMock.object);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [SettingsComponent],
            providers: [{ provide: BaseAppearanceService, useFactory: () => appearanceServiceMock.object }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('constructor', () => {
        it('should set appearanceService', () => {
            // Arrange

            // Act

            // Assert
            assert.strictEqual(componentWithInjection.appearanceService, appearanceServiceMock.object);
        });
    });
});
