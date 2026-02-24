import { Injectable, computed, signal } from '@angular/core';
import { supabase } from '../api/supabase.client';
import type { Session, User } from '@supabase/supabase-js';
import { defer, from, map, Observable, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _session = signal<Session | null>(null);
  readonly session = this._session.asReadonly();

  readonly user = computed<User | null>(() => this._session()?.user ?? null);
  readonly isAuthenticated = computed(() => !!this.user());

  constructor() {
    // initial session
    void supabase.auth.getSession().then(({ data }) => this._session.set(data.session ?? null));

    // auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      this._session.set(session ?? null);
    });
  }

  signUpEmailPassword$(email: string, password: string): Observable<void> {
    return defer(() => from(supabase.auth.signUp({ email, password }))).pipe(
      map(({ error }) => {
        if (error) throw error;
        return void 0;
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );
  }

  signInEmailPassword$(email: string, password: string): Observable<void> {
    return defer(() => from(supabase.auth.signInWithPassword({ email, password }))).pipe(
      map(({ error }) => {
        if (error) throw error;
        return void 0;
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );
  }

  sendMagicLink$(email: string): Observable<void> {
    return defer(() =>
      from(
        supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${location.origin}/auth/callback` },
        })
      )
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
        return void 0;
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );
  }

  signInWithGoogle$(): Observable<void> {
    return defer(() =>
      from(
        supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: `${location.origin}/auth/callback` },
        })
      )
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
        return void 0;
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );
  }

  signOut$(): Observable<void> {
    return defer(() => from(supabase.auth.signOut())).pipe(
      map(({ error }) => {
        if (error) throw error;
        return void 0;
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );
  }
}