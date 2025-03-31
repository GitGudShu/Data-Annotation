import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserStoreService {
  private userSubject = new BehaviorSubject<any>(this.getUserFromLocalStorage());
  public user$: Observable<any> = this.userSubject.asObservable();

  private getUserFromLocalStorage(): any {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  clear(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  getUserValue(): any {
    return this.userSubject.value;
  }
}