import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show message', () => {
    service.show('Hello World', 'success');
    expect(service.message()).toBe('Hello World');
    expect(service.type()).toBe('success');
  });

  it('should clear message', () => {
    service.show('Hello World');
    service.clear();
    expect(service.message()).toBeNull();
    expect(service.type()).toBe('info');
  });
});
