import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, from, lastValueFrom, throwError } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { AuthService } from '../service/auth.service';
import { ToastController } from '@ionic/angular';


@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {

  constructor(
    private auth: Auth,
    public navCtrl: NavController,
    private authService: AuthService,
    private toastController: ToastController,
  ) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    return from(this.handler(req, next)).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          // client side error
          errorMsg = `Error: ${error.error.message}`;
          console.log(error);
        } else {
          // server side error
          errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;

          if (error?.error?.message?.code === "auth/argument-error") {
            this.navCtrl.navigateForward('login', { animated: false });
          }
          else if (error?.error?.message?.code === "auth/id-token-expired") {
            this.navCtrl.navigateForward('login', { animated: false });
          }
        }

        return throwError(error);
      })
    )
  }

  handler(req: HttpRequest<any>, next: HttpHandler) {
    let newToken;

    const currentUser = this.auth.currentUser;

    if (currentUser) {
      return currentUser.getIdToken(false).then((res) => {
        newToken = res;

        let storedToken = localStorage.getItem('idToken');
        if (storedToken || newToken) {
          const authReq = req.clone({ headers: req.headers.set('Authorization', `Bearer ${storedToken ?? newToken}`) });

          return lastValueFrom(next.handle(authReq));
        }

        return lastValueFrom(next.handle(req));
      });
    } else {
      let storedToken = localStorage.getItem('idToken');

      const authReq = req.clone({ headers: req.headers.set('Authorization', `Bearer ${storedToken}`) });
      return lastValueFrom(next.handle(authReq));
    }
  }

  async presentToast(position: any) {
    const toast = await this.toastController.create({
      message: 'Session has expired. Please Log in again.',
      duration: 1500,
      position: position,
      color: 'danger'
    });

    await toast.present();
  }
}
