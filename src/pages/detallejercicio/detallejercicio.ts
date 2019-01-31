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
    imagen1:"",
    imagen:'',
    tipo:""
  }
  imagenaux=true
  constructor(public navCtrl: NavController, public navParams: NavParams,public rutina:RutinaProvider) {
    this.itemcompleto=this.navParams.data
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetallejercicioPage');
    this.verdetalle()
    setInterval(() => {this.cambiarImagen()},1000);
    
  }
  cambiarImagen(){
    //console.log(this.imagenaux)
    if(this.item.imagen1!='' && this.item.imagen1)
      this.imagenaux=!this.imagenaux
    else{
      this.imagenaux=true
    }
  }
  verdetalle(){
    this.rutina.verDetalleEjercicios(this.itemcompleto.idejercicio)
    .subscribe(data=>{
      //console.log(data,this.itemcompleto)
      this.item=data
      
        
    })
    
  }
}
