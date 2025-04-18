import { TestBed } from '@angular/core/testing';

import { FomService } from './fom.service';

describe('FomService', () => {
  let service: FomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
