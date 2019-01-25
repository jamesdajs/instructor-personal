import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AdmCreardietaPage } from "../adm-creardieta/adm-creardieta"
import { AdmDietasPage } from "../adm-dietas/adm-dietas"
/**
 * Generated class for the AdmTipodietaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-tipodieta',
  templateUrl: 'adm-tipodieta.html',
})
export class AdmTipodietaPage {
  tipodieta=[
    {nombre:"despues del gym"},
    {nombre:"desayuno"},
    {nombre:"merienda"},
    {nombre:"almuerzo"},
    {nombre:"cena"}
  ]
  list=[]
    constructor(public navCtrl: NavController,
      public navParams: NavParams) {
    }
  
    ionViewDidLoad() {
      console.log('ionViewDidLoad AdmtipoEjerciciosPage');
    }
 
    crear(){
      this.navCtrl.push(AdmCreardietaPage)
    }
    verejercicios(nombre){
      this.navCtrl.push(AdmDietasPage,nombre)
    }
    
  }
