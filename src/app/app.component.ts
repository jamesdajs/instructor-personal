import { Component } from '@angular/core';
import { App, Platform ,MenuController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
//import { AuthFacebookProvider } from '../providers/authfacebok/authfacebok';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform,
    public app:App, 
    public menuCtrl:MenuController,
    statusBar: StatusBar, 
    splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      statusBar.styleDefault();
      splashScreen.hide();
      this.hideSplashScreen(splashScreen)
    });
  }
  hideSplashScreen(Splashscreen) {
    if (Splashscreen) {
    setTimeout(() => {
    Splashscreen.hide();
    }, 100);
    }
    }
}
