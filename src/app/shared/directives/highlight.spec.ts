import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HighlightDirective } from './highlight';
import { By } from '@angular/platform-browser';

@Component({
  template: `<p appHighlight="#123456">Testing Highlight</p>`,
  standalone: true,
  imports: [HighlightDirective]
})
class TestComponent {}

describe('HighlightDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent, HighlightDirective]
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const p = fixture.debugElement.query(By.css('p'));
    expect(p).toBeTruthy();
  });

  it('should have background color', () => {
    const p = fixture.debugElement.query(By.css('p'));
    const el = p.nativeElement as HTMLElement;
    expect(el.style.backgroundColor).toBe('rgb(18, 52, 86)'); // #123456 converted to rgb
  });
});