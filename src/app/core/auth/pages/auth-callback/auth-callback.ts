import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer, tap } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-auth-callback-page',
  templateUrl: './auth-callback.html',
  styleUrl: './auth-callback.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule],
})
export class AuthCallbackPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // Dá um “tick” para o supabase-js concluir a sessão (onAuthStateChange/getSession)
    timer(0)
      .pipe(
        tap(() => {
          this.router.navigateByUrl(this.auth.isAuthenticated() ? '/feed' : '/login');
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}