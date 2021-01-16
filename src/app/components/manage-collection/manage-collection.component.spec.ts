import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { ManageCollectionComponent } from './manage-collection.component';

describe('ManageCollectionComponent', () => {
    let component: ManageCollectionComponent;
    let fixture: ComponentFixture<ManageCollectionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [ManageCollectionComponent],
            providers: [BaseAppearanceService],
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
