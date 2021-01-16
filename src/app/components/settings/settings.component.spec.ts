import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
    let component: SettingsComponent;
    let fixture: ComponentFixture<SettingsComponent>;

    let componentWithMocks: SettingsComponent;
    let appearanceServiceMock: IMock<BaseAppearanceService>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [SettingsComponent],
            providers: [BaseAppearanceService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        componentWithMocks = new SettingsComponent(appearanceServiceMock.object);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('constructor', () => {
        it('should set appearanceService', () => {
            // Arrange

            // Act

            // Assert
            assert.strictEqual(componentWithMocks.appearanceService, appearanceServiceMock.object);
        });
    });
});
