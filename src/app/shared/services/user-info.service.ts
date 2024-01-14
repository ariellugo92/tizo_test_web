import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserData } from '../../modules/users/interfaces/user-data.interface';

@Injectable({providedIn: 'root'})
export class UserInfoService {

  private userLogged$ = new BehaviorSubject<Partial<UserData> | null>(null);

  constructor() { }

  setUserLogged(value: Partial<UserData>) {
    this.userLogged$.next(value);
  }

  getUserLogged(): Observable<Partial<UserData> | null> {
    return this.userLogged$.asObservable();
  }

}
