import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/service/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { Auth } from '@angular/fire/auth';

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

  ionViewWillEnter(): void{
    this.loginForm.reset();
  }

  async login() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    await this.authService.login(email, password);
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
