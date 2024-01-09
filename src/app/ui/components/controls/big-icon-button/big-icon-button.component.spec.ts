import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigIconButtonComponent } from './big-icon-button.component';

describe('BigIconButtonComponent', () => {
  let component: BigIconButtonComponent;
  let fixture: ComponentFixture<BigIconButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BigIconButtonComponent]
    });
    fixture = TestBed.createComponent(BigIconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
