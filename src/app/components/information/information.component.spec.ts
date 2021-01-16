import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { InformationComponent } from './information.component';

describe('InformationComponent', () => {
    let component: InformationComponent;
    let fixture: ComponentFixture<InformationComponent>;

    let componentWithMocks: InformationComponent;
    let appearanceServiceMock: IMock<BaseAppearanceService>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [InformationComponent],
            providers: [BaseAppearanceService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        componentWithMocks = new InformationComponent(appearanceServiceMock.object);
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
