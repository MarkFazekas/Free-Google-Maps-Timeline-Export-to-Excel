import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineViewerComponent } from './timeline-viewer.component';

describe('TimelineViewerComponent', () => {
  let component: TimelineViewerComponent;
  let fixture: ComponentFixture<TimelineViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
