import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Facebook } from '@ionic-native/facebook';
import { Platform } from 'ionic-angular';

import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase/app';


import { auth } from 'firebase';
import { Observable } from "rxjs/Observable";
@Injectable()
export class AuthFacebookProvider {
    constructor(private afAuth: AngularFireAuth, private fb: Facebook, private platform: Platform,
        private googlePlus: GooglePlus) {

    }
    googleLogin(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.googlePlus.login({
                'webClientId': '5351366995-npuh9q89gaoiagoc4jssqck26gorj7hh.apps.googleusercontent.com',
                'offline': true
            }).then(res => {
                const googleCredential = firebase.auth.GoogleAuthProvider
                    .credential(res.idToken);

                firebase.auth().signInWithCredential(googleCredential)
                    .then(response => {
                        console.log("Firebase success: " + JSON.stringify(response));
                        resolve("Firebase success: " + JSON.stringify(response))
                    });
            }, err => {
                console.error("Error: ", err)
                reject(err);
            });
        });
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
                        observer.next(res.user);
                    }).catch(error => {
                        observer.error(error);
                    });
            }
        });
    }
    logout() {
        this.afAuth.auth.signOut();
        this.fb.logout()
            .then(() => {
                console.log("cerrando sesion de ios")
            })
    }
    veriduser() {
        return Promise.resolve(this.afAuth.auth.currentUser.uid)
    }
    veridusercompleto() {
        return Promise.resolve(this.afAuth.auth.currentUser)
    }
}
