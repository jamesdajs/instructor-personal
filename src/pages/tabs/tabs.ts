import { Component } from '@angular/core';
import {NavController,App,Events,Platform,AlertController} from 'ionic-angular';
import { RutinasPage } from '../rutinas/rutinas';
import { DietasPage } from '../dietas/dietas';
//import { EstadisticasPage } from '../estadisticas/estadisticas';
import { DatospersonalesPage } from '../datospersonales/datospersonales';
import { InstructoresPage } from '../instructores/instructores';
//import { UsuarioProvider } from '../../providers/usuario/usuario';

import { SplashScreen } from '@ionic-native/splash-screen';

import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  valor=true
  tabRoot = InstructoresPage;
  tab1Root = RutinasPage;
  tab2Root = DietasPage;
  //tab3Root = EstadisticasPage;
  tab4Root = DatospersonalesPage

  constructor( public event:Events,
    public navCtrl:NavController,app:App,
    public splash:SplashScreen,public platform:Platform,
    public alertCtrl:AlertController,
    private store:Storage
    ) {
      platform.registerBackButtonAction(() => {
        let alert = alertCtrl.create({
          title: 'Salir de la aplicasion',
          message: 'Seguro que desea salir de la aplicasion?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Ok',
              handler: () => {
                
            platform.exitApp();
              }
            }
          ]
        });
        alert.present();
      },1);
    
    
    
  }
  unregisterBackButtonAction: any;
  ionViewDidLoad(){
    this.versitienenIns()
    this.splash.hide()
  }
  versitienenIns(){
    
    this.store.get("key1")
      .then(key=>{
        console.log(key)
        this.valor=key==null?false:true
      })
  }
}
