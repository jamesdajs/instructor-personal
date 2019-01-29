import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RutinaProvider } from '../../providers/rutina/rutina'

/**
 * Generated class for the AdmCreartiporutinaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-creartiporutina',
  templateUrl: 'adm-creartiporutina.html',
})
export class AdmCreartiporutinaPage {
nombre =""
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private rutina:RutinaProvider
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmCreartiporutinaPage');
  }
  guardar(){
    this.rutina.creartipoEjercicio({nombre:this.nombre})
  }

}
