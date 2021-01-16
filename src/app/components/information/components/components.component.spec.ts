import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import assert from 'assert';
import { ExternalComponent } from '../../../core/base/external-component';
import { ComponentsComponent } from './components.component';

describe('ComponentsComponent', () => {
    let component: ComponentsComponent;
    let fixture: ComponentFixture<ComponentsComponent>;

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
            const componentsComponent: ComponentsComponent = new ComponentsComponent();

            // Act
            const externalComponents: ExternalComponent[] = componentsComponent.externalComponents;

            // Assert
            assert.ok(externalComponents.length > 0);
        });
    });
});
