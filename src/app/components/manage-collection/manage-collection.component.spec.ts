import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IMock, Mock } from 'typemoq';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { ManageCollectionComponent } from './manage-collection.component';

describe('ManageRefreshComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let componentWithInjection: ManageCollectionComponent;

    let component: ManageCollectionComponent;
    let fixture: ComponentFixture<ManageCollectionComponent>;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        componentWithInjection = new ManageCollectionComponent(appearanceServiceMock.object);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [ManageCollectionComponent],
            providers: [{ provide: BaseAppearanceService, useFactory: () => appearanceServiceMock.object }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ManageCollectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
