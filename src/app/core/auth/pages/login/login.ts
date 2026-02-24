import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, of, tap } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatProgressBarModule
  ],
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  readonly busy = signal(false);
  readonly year = signal(new Date().getFullYear());

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl('/feed');
    }
  }

  onLoginEmailPassword(): void {
    if (this.form.invalid) return;
    const { email, password } = this.form.getRawValue();

    this.busy.set(true);
    this.auth
      .signInEmailPassword$(email, password)
      .pipe(
        tap(() => this.router.navigateByUrl('/feed')),
        catchError((e: any) => {
          this.snack.open(e?.message ?? 'Falha no login', 'OK', { duration: 3500 });
          return of(void 0);
        }),
        finalize(() => this.busy.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  onSignUp(): void {
    if (this.form.invalid) return;
    const { email, password } = this.form.getRawValue();

    this.busy.set(true);
    this.auth
      .signUpEmailPassword$(email, password)
      .pipe(
        tap(() =>
          this.snack.open(
            'Conta criada. Se tiveres confirmação de email ativa, verifica o teu email.',
            'OK',
            { duration: 4500 }
          )
        ),
        catchError((e: any) => {
          this.snack.open(e?.message ?? 'Falha ao criar conta', 'OK', { duration: 3500 });
          return of(void 0);
        }),
        finalize(() => this.busy.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  onMagicLink(): void {
    const emailCtrl = this.form.controls.email;
    if (emailCtrl.invalid) return;

    this.busy.set(true);
    this.auth
      .sendMagicLink$(emailCtrl.value)
      .pipe(
        tap(() => this.snack.open('Magic link enviado. Verifica o teu email.', 'OK', { duration: 4500 })),
        catchError((e: any) => {
          this.snack.open(e?.message ?? 'Falha ao enviar magic link', 'OK', { duration: 3500 });
          return of(void 0);
        }),
        finalize(() => this.busy.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  onGoogle(): void {
    this.busy.set(true);
    this.auth
      .signInWithGoogle$()
      .pipe(
        // OAuth vai redirecionar; não navegamos aqui.
        catchError((e: any) => {
          this.snack.open(e?.message ?? 'Falha no login Google', 'OK', { duration: 3500 });
          return of(void 0);
        }),
        finalize(() => this.busy.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
