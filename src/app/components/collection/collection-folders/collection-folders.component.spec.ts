import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSplitModule } from 'angular-split';
import { IMock, It, Mock } from 'typemoq';
import { Hacks } from '../../../core/hacks';
import { Desktop } from '../../../core/io/desktop';
import { BaseSettings } from '../../../core/settings/base-settings';
import { BaseFolderService } from '../../../services/folder/base-folder.service';
import { BaseNavigationService } from '../../../services/navigation/base-navigation.service';
import { CollectionFoldersComponent } from './collection-folders.component';

describe('CollectionFoldersComponent', () => {
    let settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();
    let folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
    let navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
    let hacksMock: IMock<Hacks> = Mock.ofType<Hacks>();

    let componentWithInjection: CollectionFoldersComponent;

    let component: CollectionFoldersComponent;
    let fixture: ComponentFixture<CollectionFoldersComponent>;

    beforeEach(() => {
        settingsMock = Mock.ofType<BaseSettings>();
        folderServiceMock = Mock.ofType<BaseFolderService>();
        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        hacksMock = Mock.ofType<Hacks>();

        folderServiceMock.setup((x) => x.getFolders()).returns(() => []);
        folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);

        componentWithInjection = new CollectionFoldersComponent(
            settingsMock.object,
            folderServiceMock.object,
            navigationServiceMock.object,
            hacksMock.object
        );
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), AngularSplitModule],
            declarations: [CollectionFoldersComponent],
            providers: [
                Desktop,
                { provide: BaseSettings, useFactory: () => settingsMock.object },
                { provide: BaseFolderService, useFactory: () => folderServiceMock.object },
                { provide: BaseNavigationService, useFactory: () => navigationServiceMock.object },
                { provide: Hacks, useFactory: () => hacksMock.object },
            ],
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
