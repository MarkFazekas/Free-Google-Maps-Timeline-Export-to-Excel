import { TestBed } from '@angular/core/testing';

import { TimelineViewerService } from './timeline-viewer.service';

describe('TimelineViewerService', () => {
  let service: TimelineViewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimelineViewerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
