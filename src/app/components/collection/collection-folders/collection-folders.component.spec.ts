import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSplitModule } from 'angular-split';
import { Hacks } from '../../../core/hacks';
import { BaseSettings } from '../../../core/settings/base-settings';
import { BaseFolderService } from '../../../services/folder/base-folder.service';
import { BaseNavigationService } from '../../../services/navigation/base-navigation.service';
import { CollectionFoldersComponent } from './collection-folders.component';

describe('CollectionFoldersComponent', () => {
    let component: CollectionFoldersComponent;
    let fixture: ComponentFixture<CollectionFoldersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), AngularSplitModule],
            declarations: [CollectionFoldersComponent],
            providers: [BaseSettings, BaseFolderService, BaseNavigationService, Hacks],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CollectionFoldersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
