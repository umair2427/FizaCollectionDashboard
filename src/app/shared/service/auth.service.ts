import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  sessionExpire(){
    localStorage.removeItem('idToken');
  }
}
