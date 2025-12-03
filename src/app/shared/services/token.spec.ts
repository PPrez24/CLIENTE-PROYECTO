import { TestBed } from '@angular/core/testing';
import { Token } from './token';
import { PLATFORM_ID } from '@angular/core';

describe('Token Service', () => {
  let service: Token;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Token,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(Token);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get token', () => {
    service.setToken('abc-123');
    expect(service.getToken()).toBe('abc-123');
    expect(service.hasToken()).toBeTrue();
  });

  it('should clear token', () => {
    service.setToken('abc-123');
    service.clearToken();
    expect(service.getToken()).toBe('');
    expect(service.hasToken()).toBeFalse();
  });
});
