import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Token } from '../services/token';

/**
 * Structural directive to show content based on authentication state.
 * Usage:
 *  <ng-container *appAuthVisible="'auth'">Shown only when logged in</ng-container>
 *  <ng-container *appAuthVisible="'guest'">Shown only when NOT logged in</ng-container>
 */
@Directive({ selector: '[appAuthVisible]' })
export class AuthVisibleDirective implements OnDestroy {
  private mode: 'auth' | 'guest' = 'auth';
  private sub: Subscription | null = null;
  private isViewCreated = false;

  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private token: Token
  ) {}

  @Input()
  set appAuthVisible(value: 'auth' | 'guest') {
    this.mode = value || 'auth';
    
    // Unsubscribe from previous subscription if exists
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null;
    }
    
    // Subscribe to token changes with distinctUntilChanged to avoid duplicate emissions
    this.sub = this.token.token$
      .pipe(distinctUntilChanged())
      .subscribe(() => this.updateView());
    
    // Initial view update
    this.updateView();
  }

  private updateView() {
    const logged = this.token.hasToken();
    const shouldShow = (this.mode === 'auth') ? logged : !logged;
    
    // Only update if state actually changed
    if (shouldShow && !this.isViewCreated) {
      this.vcr.createEmbeddedView(this.tpl);
      this.isViewCreated = true;
    } else if (!shouldShow && this.isViewCreated) {
      this.vcr.clear();
      this.isViewCreated = false;
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
