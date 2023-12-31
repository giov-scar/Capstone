import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Database, set, ref, getDatabase } from '@angular/fire/database';

import { environment } from 'src/environments/environment';
import { Artist } from 'src/app/classes/artist';
import { BehaviorSubject } from 'rxjs';
import { UserCredential } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  usersUrl: string = environment.firebase.databaseURL + '/users';
  isLogged = new BehaviorSubject<boolean>(false);

  constructor(
    public fsAuth: Auth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public database: Database,
    private http: HttpClient
  ) {
    this.fsAuth.onAuthStateChanged((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.removeItem('user');
      }
      this.isLogged.next(!!user);
    });
  }

  // Sign in with email/password
  async SignIn(auth: Auth, email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      this.router.navigate(['dashboard']);
    } catch (error) {
      console.log(error);
    }
  }

  // Sign up with email/password
  async SignUp(auth: Auth, artist: Artist): Promise<UserCredential> {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        artist.email,
        artist.password
      );
      this.writeUserData(artist, result.user);
      console.log(artist);
      this.router.navigate(['dashboard']);
      return result
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  writeUserData(artist: Artist, user: User) {
    const db = getDatabase();
    const defaultProfileImageUrl = 'https://images.unsplash.com/photo-1673586410488-b694d350756e?q=80&w=2728&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    const defaultCoverImageUrl = 'https://images.unsplash.com/photo-1673586410488-b694d350756e?q=80&w=2728&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

    set(ref(db, 'users/' + user.uid), {
      uid: user.uid,
      artistname: artist.artistname,
      artistsurname: artist.artistsurname,
      email: user.email,
      profile_picture: artist.profile_picture || defaultProfileImageUrl,
      coverImg: artist.coverImg || defaultCoverImageUrl,
      baCourse: artist.baCourse,
      maCourse: artist.maCourse,
      intro: artist.intro,
      uploadedWork: artist.uploadedWork
    });
  }

  // Reset password
  async ForgotPassword(auth: Auth, passwordResetEmail: string) {
    try {
      await sendPasswordResetEmail(auth, passwordResetEmail);
    } catch (error) {
      console.log(error);
    }
  }

  // Sign out
  async SignOut() {
    await this.fsAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['home']);
  }

  // Returns true when user is logged in
  isLoggedIn(): boolean {
    // console.log(this.isLogged.getValue());
    return localStorage.getItem('user') ? true : false;
  }

  // Get logged in user data
  getUser(): Artist {
    return this.userData as Artist;
  }
}
