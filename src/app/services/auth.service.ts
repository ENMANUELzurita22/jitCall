import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userData: any;
  private authState = new BehaviorSubject<boolean>(false);

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        this.authState.next(true);
      } else {
        this.userData = null;
        this.authState.next(false);
      }
    });
  }

  async register(email: string, password: string, userData: any) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      await this.afs.collection('users').doc(result.user?.uid).set({
        ...userData,
        email: email
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      throw error;
    }
  }

  isAuthenticated() {
    return this.authState.asObservable();
  }

  getCurrentUser() {
    return this.userData;
  }
} 