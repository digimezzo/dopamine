import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { BaseSettings } from '../../../core/settings/base-settings';
import { AdvancedSettingsComponent } from './advanced-settings.component';

describe('AdvancedSettingsComponent', () => {
    let settingsMock: IMock<BaseSettings>;
    let componentWithInjection: AdvancedSettingsComponent;

    let component: AdvancedSettingsComponent;
    let fixture: ComponentFixture<AdvancedSettingsComponent>;

    beforeEach(() => {
        settingsMock = Mock.ofType<BaseSettings>();
        componentWithInjection = new AdvancedSettingsComponent(settingsMock.object);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [AdvancedSettingsComponent],
            providers: [BaseSettings],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdvancedSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('constructor', () => {
        it('should set settings', () => {
            // Arrange

            // Act

            // Assert
            assert.ok(componentWithInjection.settings != undefined);
        });
    });
});
