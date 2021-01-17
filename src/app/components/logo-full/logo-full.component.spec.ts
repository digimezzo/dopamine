import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import * as assert from 'assert';
import { LogoFullComponent } from './logo-full.component';

describe('LogoFullComponent', () => {
    let componentWithInjection: LogoFullComponent;

    let component: LogoFullComponent;
    let fixture: ComponentFixture<LogoFullComponent>;

    beforeEach(() => {
        componentWithInjection = new LogoFullComponent();
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [LogoFullComponent],
            providers: [],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LogoFullComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('applicationName', () => {
        it('should provide correct application name', () => {
            // Arrange

            // Act

            // Assert
            assert.strictEqual(componentWithInjection.applicationName, 'dopamine');
        });
    });
});
