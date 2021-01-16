import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { LicenseDialogComponent } from './license-dialog.component';

describe('LicenseDialogComponent', () => {
    let component: LicenseDialogComponent;
    let fixture: ComponentFixture<LicenseDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), MatDialogModule],
            declarations: [LicenseDialogComponent],
            providers: [],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LicenseDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
