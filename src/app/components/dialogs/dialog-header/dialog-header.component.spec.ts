import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { DialogHeaderComponent } from './dialog-header.component';

describe('DialogHeaderComponent', () => {
    let component: DialogHeaderComponent;
    let fixture: ComponentFixture<DialogHeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), MatDialogModule],
            declarations: [DialogHeaderComponent],
            providers: [],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DialogHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
