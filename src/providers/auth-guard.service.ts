import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
@Injectable()

export class AuthGuard implements CanActivate {

    constructor(public authenticationService: AuthenticationService, private router: Router) { }

    canActivate(): boolean {

        console.log(this.authenticationService.isAuthenticated());
        if (!this.authenticationService.isAuthenticated()) {
          this.router.navigate(['/tabs/login']);
          return false;
        }
        return true;
      }


      

}