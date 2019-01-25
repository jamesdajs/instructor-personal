import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AdmCrearejercicioPage } from "../adm-crearejercicio/adm-crearejercicio"
import { AdmEjerciciosPage } from "../adm-ejercicios/adm-ejercicios"
/**
 * Generated class for the AdmTipoejercicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-tipoejercicio',
  templateUrl: 'adm-tipoejercicio.html',
})
export class AdmTipoejercicioPage {
  tipoejer=[
    {nombre:"hombro"},
    {nombre:"brazos"},
    {nombre:"piernas"}
  ]
  list=[]
    constructor(public navCtrl: NavController,
      public navParams: NavParams) {
    }
  
    ionViewDidLoad() {
      console.log('ionViewDidLoad AdmtipoEjerciciosPage');
    }
 
    crear(){
      this.navCtrl.push(AdmCrearejercicioPage)
    }
    verejercicios(nombre){
      this.navCtrl.push(AdmEjerciciosPage,nombre)
    }
    
  }
