import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Facebook} from '@ionic-native/facebook';
import {Platform} from 'ionic-angular';

//import firebase from 'firebase/app';


import {auth} from 'firebase';
import {Observable} from "rxjs/Observable";
@Injectable()
export class AuthFacebookProvider {
constructor(private afAuth: AngularFireAuth, private fb: Facebook, private platform: Platform) {
  
  }
  loginWithFacebook() {
    return Observable.create(observer => {
      if (this.platform.is('cordova')) {
        this.fb.login(['email', 'public_profile']).then(res => {
          const facebookCredential = auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
          this.afAuth.auth.signInWithCredential(facebookCredential).then(user => {
            observer.next(user);
          }).catch(error => {
            observer.error(error);
          });
        }).catch((error) => {
          observer.error(error);
        });
      } else {
        this.afAuth.auth
          .signInWithPopup(new auth.FacebookAuthProvider())
          .then((res) => {
            observer.next(res);
          }).catch(error => {
          observer.error(error);
        });
      }
    });
  }
  logout() {
    this.afAuth.auth.signOut();
  }
  veriduser(){
    return Promise.resolve(this.afAuth.auth.currentUser.uid)
  }
  veridusercompleto(){
    return Promise.resolve(this.afAuth.auth.currentUser)
  }
}
