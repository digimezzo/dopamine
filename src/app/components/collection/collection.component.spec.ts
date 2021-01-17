import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IMock, Mock } from 'typemoq';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { CollectionComponent } from './collection.component';

describe('CollectionComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();

    let componentWithInjection: CollectionComponent;

    let component: CollectionComponent;
    let fixture: ComponentFixture<CollectionComponent>;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();

        componentWithInjection = new CollectionComponent(appearanceServiceMock.object);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [CollectionComponent],
            providers: [{ provide: BaseAppearanceService, useFactory: () => appearanceServiceMock.object }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CollectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
