import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IMock, Mock } from 'typemoq';
import { BaseSettings } from '../../../core/settings/base-settings';
import { BaseIndexingService } from '../../../services/indexing/base-indexing.service';
import { ManageAlbumCoversComponent } from './manage-album-covers.component';

describe('ManageAlbumCoversComponent', () => {
    let settingsMock: IMock<BaseSettings>;
    let indexingServiceMock: IMock<BaseIndexingService>;
    let componentWithInjection: ManageAlbumCoversComponent;

    let component: ManageAlbumCoversComponent;
    let fixture: ComponentFixture<ManageAlbumCoversComponent>;

    beforeEach(() => {
        settingsMock = Mock.ofType<BaseSettings>();
        indexingServiceMock = Mock.ofType<BaseIndexingService>();
        componentWithInjection = new ManageAlbumCoversComponent(settingsMock.object, indexingServiceMock.object);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [ManageAlbumCoversComponent],
            providers: [
                { provide: BaseSettings, useFactory: () => settingsMock.object },
                { provide: BaseIndexingService, useFactory: () => indexingServiceMock.object },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ManageAlbumCoversComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
