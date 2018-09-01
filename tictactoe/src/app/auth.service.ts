import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import  { tap, delay } from 'rxjs/operators';
@Injectable()
export class AuthService {
  isLoggedin = false;

  redirectUrl: string;



}
