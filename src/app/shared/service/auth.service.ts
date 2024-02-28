import { Injectable, Optional } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    @Optional() private auth: Auth,
    private router: Router,) { }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password).then(async (res: any) => {
        localStorage.setItem('idToken', res._tokenResponse.idToken);
        this.router.navigate(['/products'])
      })
    } catch (error) {
      console.error('Login failed:', error);
    }
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
