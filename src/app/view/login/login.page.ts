import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/service/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    @Optional() private auth: Auth,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,

  ) { }
  loginForm!: FormGroup;
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  login() {
    let email = this.loginForm.value.email;
    let password = this.loginForm.value.password;
    signInWithEmailAndPassword(this.auth, email, password).then(async (res: any) => {
      localStorage.setItem('idToken', res._tokenResponse.idToken);
      this.router.navigate(['/products'])
    })
  }

  async presentToast(position: any) {
    const toast = await this.toastController.create({
      message: 'Please enter valid email or password',
      duration: 1500,
      position: position,
      color: 'danger'
    });

    await toast.present();
  }
}
