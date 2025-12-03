import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Register } from './register';
import { FirebaseAuthService } from '../../shared/services/firebase-auth';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Register Component', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Register,
        RouterTestingModule,
      ],
      providers: [
        { provide: FirebaseAuthService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.registerForm.valid).toBeFalse();
  });

  it('should validate password match', () => {
    const password = component.registerForm.controls['password'];
    const confirm = component.registerForm.controls['confirmPassword'];

    password.setValue('123456');
    confirm.setValue('654321');

    expect(component.registerForm.hasError('passwordMismatch')).toBeTrue();
  });
});
