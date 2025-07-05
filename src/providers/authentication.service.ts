import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { LocalService } from './local.service';


@Injectable()
export class AuthenticationService {

  authState = new BehaviorSubject(false);
  token: any;
  constructor(
    private router: Router,
    private platform: Platform,
    private localStore: LocalService,
    public toastController: ToastController
  ) {
  //  this.platform.ready().then(() => {
   //   this.ifLoggedIn();
   // });
  }


  isLoggedIn: boolean = false;



ifLoggedIn() {
  this.authState.next(true);
}


async login(userinfo: string) {
   // this.storage.set('USER_INFO', userinfo).then((response) => {
   //   this.router.navigate(['dashboard']);
      this.authState.next(true);
   // });
  }

  logout() {
    this.router.navigate(['login']);
    this.authState.next(false);
  }

  isAuthenticated() {
    return this.authState.value;
  }


  getToken() {
    this.token = this.localStore.getItem('token');    
    return this.token;
  }  
  


}