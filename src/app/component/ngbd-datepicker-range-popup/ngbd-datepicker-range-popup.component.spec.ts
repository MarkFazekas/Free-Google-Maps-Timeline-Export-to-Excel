import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbdDatepickerRangePopupComponent } from './ngbd-datepicker-range-popup.component';

describe('NgbdDatepickerRangePopupComponent', () => {
  let component: NgbdDatepickerRangePopupComponent;
  let fixture: ComponentFixture<NgbdDatepickerRangePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgbdDatepickerRangePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgbdDatepickerRangePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
