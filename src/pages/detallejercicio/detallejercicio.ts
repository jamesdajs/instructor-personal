import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { RutinaProvider } from '../../providers/rutina/rutina';
/**
 * Generated class for the DetallejercicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detallejercicio',
  templateUrl: 'detallejercicio.html',
})
export class DetallejercicioPage {
  itemcompleto
  item={
    nombre:"",
    deslarga:"",
    linkyoutube:"",
    tipo:""
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,public rutina:RutinaProvider) {
    this.itemcompleto=this.navParams.data
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetallejercicioPage');
    this.verdetalle()
  }
  verdetalle(){
    this.rutina.verDetalleEjercicios(this.itemcompleto.idejercicio)
    .subscribe(data=>{
      console.log(data,this.itemcompleto)
      this.item=data
    })
    
  }
}
