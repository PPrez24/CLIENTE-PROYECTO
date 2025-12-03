import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth-guard';
import { Token } from '../services/token';
import { FirebaseAuthService } from '../services/firebase-auth';
import { Subject } from 'rxjs';

describe('AuthGuard', () => {
  let mockRouter: any;
  let mockToken: any;
  let mockAuth: any;
  let authStateSubject: Subject<any>;

  beforeEach(() => {
    authStateSubject = new Subject<any>();
    mockRouter = { navigateByUrl: jasmine.createSpy('navigateByUrl') };
    mockToken = { hasToken: jasmine.createSpy('hasToken').and.returnValue(false) };
    mockAuth = { authState$: authStateSubject.asObservable() };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Token, useValue: mockToken },
        { provide: FirebaseAuthService, useValue: mockAuth }
      ]
    });
  });

  it('should allow access if token exists', () => {
    mockToken.hasToken.and.returnValue(true);
    
    const result = TestBed.runInInjectionContext(() => 
      authGuard({} as any, {} as any)
    );

    expect(result).toBeTrue();
  });

  it('should redirect to login if no token and no firebase user', (done) => {
    mockToken.hasToken.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => 
      authGuard({} as any, {} as any)
    );

    if (result instanceof Promise) {
      result.then(allowed => {
        expect(allowed).toBeFalse();
        expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/auth/login');
        done();
      });
      
      // Emit value asynchronously to avoid "sub is undefined" error
      setTimeout(() => {
        authStateSubject.next(null);
      }, 10);
    } else {
      fail('Guard should return a Promise');
      done();
    }
  });
});
