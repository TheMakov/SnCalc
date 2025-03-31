import { TestBed } from '@angular/core/testing';

import { PermutationsService } from './permutations.service';

describe('PermutationsService', () => {
  let service: PermutationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermutationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
