import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IMock, Mock } from 'typemoq';
import { BaseSettings } from '../../../core/settings/base-settings';
import { BaseIndexingService } from '../../../services/indexing/base-indexing.service';
import { ManageRefreshComponent } from './manage-refresh.component';

describe('ManageRefreshComponent', () => {
    let settingsMock: IMock<BaseSettings>;
    let indexingServiceMock: IMock<BaseIndexingService>;
    let componentWithInjection: ManageRefreshComponent;

    let component: ManageRefreshComponent;
    let fixture: ComponentFixture<ManageRefreshComponent>;

    beforeEach(() => {
        settingsMock = Mock.ofType<BaseSettings>();
        indexingServiceMock = Mock.ofType<BaseIndexingService>();
        componentWithInjection = new ManageRefreshComponent(settingsMock.object, indexingServiceMock.object);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [ManageRefreshComponent],
            providers: [
                { provide: BaseSettings, useFactory: () => settingsMock.object },
                { provide: BaseIndexingService, useFactory: () => indexingServiceMock.object },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ManageRefreshComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
