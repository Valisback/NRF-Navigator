import { TestBed } from '@angular/core/testing';

import { DbCompanyService } from './db-company.service';

describe('DbCompanyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DbCompanyService = TestBed.get(DbCompanyService);
    expect(service).toBeTruthy();
  });
});
