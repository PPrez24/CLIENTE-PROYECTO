import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnInit {
  @Input('appHighlight') color: string = '#fff7ed';
  constructor(private el: ElementRef) {}
  ngOnInit() {
    const native = this.el.nativeElement as HTMLElement;
    native.style.transition = 'background-color .6s ease';
    native.style.backgroundColor = this.color;
    setTimeout(()=> native.style.backgroundColor = 'transparent', 1200);
  }
}