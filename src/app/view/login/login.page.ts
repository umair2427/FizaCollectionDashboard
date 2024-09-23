import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/service/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  message!: string;
  color!: string;

  isLoading$!: Observable<boolean>;


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

    this.isLoading$ = this.authService.isLoading$;
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  ionViewWillEnter(): void {
    this.loginForm.reset();
  }

  onSubmit() {
    const {
      email,
      password
    } = this.loginForm.value;
    this.authService.login(email, password).then(
      (res: any) => {
        if (res) {
          this.router.navigate(['/products'])
          this.message = 'You are successfully login'
          this.color = 'success';
          this.loginForm.reset();
          this.presentToast('top');
        } else {
          this.message = 'Something went wrong! Please enter valid email or password';
          this.color = 'danger';
          this.presentToast('top');
        }
      }
    )
  }

  async presentToast(position: any) {
    const toast = await this.toastController.create({
      message: this.message,
      duration: 1500,
      position: position,
      color: this.color,
      cssClass: 'text-center'
    });

    await toast.present();
  }
}
