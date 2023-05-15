import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private cookieService: CookieService, private router: Router) {}

  canActivate(): any {
    const token = this.cookieService.get('token');

    if (token) {
      this.router.navigate(['/home']);
    }

    this.router.navigate(['/login']);
  }
}
