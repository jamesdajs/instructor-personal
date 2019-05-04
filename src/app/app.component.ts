import { Component } from '@angular/core';
import { App, Platform, MenuController, AlertController, Events, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { NetworkProvider } from '../providers/network/network';
import { Network } from '@ionic-native/network';
//import { AuthFacebookProvider } from '../providers/authfacebok/authfacebok';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = LoginPage;

    constructor(platform: Platform,
        public app: App,
        public menuCtrl: MenuController,
        public alertCtrl: AlertController,
        statusBar: StatusBar,

        public splash: SplashScreen,
        private networkProvider: NetworkProvider,
        private network: Network,
        public toastController: ToastController,
        private events: Events) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.

            statusBar.styleDefault();
            this.networkProvider.initializeNetworkEvents();

            // Offline event
            this.events.subscribe('network:offline', () => {
                //alert('No tienen coneccion a internet '); 
                this.toastController.create({
                    message: "No tiene conección a internet",
                    position: "middle"
                }).present()
            });

            // Online event
            this.events.subscribe('network:online', () => {
                alert('Conectado mediante ' + this.network.type + " la aplicación se reiniciará automaticamente");

                this.splash.show()
                window.location.reload();
            });
        });

    }

}
