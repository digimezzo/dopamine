import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { InformationComponent } from './information.component';

describe('InformationComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;

    let componentWithInjection: InformationComponent;

    let component: InformationComponent;
    let fixture: ComponentFixture<InformationComponent>;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        componentWithInjection = new InformationComponent(appearanceServiceMock.object);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [InformationComponent],
            providers: [{ provide: BaseAppearanceService, useFactory: () => appearanceServiceMock.object }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('constructor', () => {
        it('should set appearanceService', () => {
            // Arrange

            // Act

            // Assert
            assert.strictEqual(componentWithInjection.appearanceService, appearanceServiceMock.object);
        });
    });
});
