import { Injectable, Optional } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  readonly isLoading$ = this.isLoading.asObservable();

  constructor(
    @Optional() private auth: Auth,
    private router: Router,) { }

  private setLoading(isLoading: boolean): void {
    this.isLoading.next(isLoading);
  }

  async login(email: string, password: string): Promise<any> {
    try {
      this.setLoading(true);
      const res: any = await signInWithEmailAndPassword(this.auth, email, password);

      if (res) {
        this.setLoading(false);
        localStorage.setItem('idToken', res._tokenResponse.idToken);
        return res._tokenResponse.idToken;
      }
    } catch (error) {
      this.setLoading(false);
      console.error('Login failed:', error);
      return null;
    }

    return null;
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      localStorage.removeItem('idToken');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  isAuthenticated(): boolean {
    // console.log(this.auth);

    const idToken = localStorage.getItem('idToken');
    return !!idToken;
  }
}
