import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Desktop } from '../../core/io/desktop';
import { Logger } from '../../core/logger';
import { BaseSettings } from '../../core/settings/base-settings';
import { BaseDialogService } from '../../services/dialog/base-dialog.service';
import { BaseFolderService } from '../../services/folder/base-folder.service';
import { BaseIndexingService } from '../../services/indexing/base-indexing.service';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';
import { AddFolderComponent } from './add-folder.component';

describe('AddFolderComponent', () => {
    let component: AddFolderComponent;
    let fixture: ComponentFixture<AddFolderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [AddFolderComponent],
            providers: [Desktop, BaseTranslatorService, BaseFolderService, BaseDialogService, BaseIndexingService, BaseSettings, Logger],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddFolderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
