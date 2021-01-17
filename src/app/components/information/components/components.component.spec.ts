import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import assert from 'assert';
import { ExternalComponent } from '../../../core/base/external-component';
import { ComponentsComponent } from './components.component';

describe('ComponentsComponent', () => {
    let componentWithInjection: ComponentsComponent;

    let component: ComponentsComponent;
    let fixture: ComponentFixture<ComponentsComponent>;

    beforeEach(() => {
        componentWithInjection = new ComponentsComponent();
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [ComponentsComponent],
            providers: [],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ComponentsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('externalComponents', () => {
        it('should return a list of external components', async () => {
            // Arrange

            // Act
            const externalComponents: ExternalComponent[] = componentWithInjection.externalComponents;

            // Assert
            assert.ok(externalComponents.length > 0);
        });
    });
});
