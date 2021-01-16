import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BaseSettings } from '../../../core/settings/base-settings';
import { BaseIndexingService } from '../../../services/indexing/base-indexing.service';
import { ManageAlbumCoversComponent } from './manage-album-covers.component';

describe('ManageAlbumCoversComponent', () => {
    let component: ManageAlbumCoversComponent;
    let fixture: ComponentFixture<ManageAlbumCoversComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [ManageAlbumCoversComponent],
            providers: [BaseSettings, BaseIndexingService],
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
