import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';


import { DietasProvider } from '../../providers/dietas/dietas'
import { AdmModdietaPage } from '../adm-moddieta/adm-moddieta';
/**
 * Generated class for the DetalledietaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalledieta',
  templateUrl: 'detalledieta.html',
})
export class DetalledietaPage {
  item:any={
  }
  list={
    imagen:"",
    nombre:"",
    deslarga:""
  }
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dieta:DietasProvider,
    public load:LoadingController
     
     ) {
    this.item=navParams.data
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalledietaPage');
    this.mostrardetalle()
  }
  mostrardetalle(){
    if(this.item.iddietas){
      this.dieta.verDetalleDieta(this.item.iddietas)
      .subscribe(list=>{
        this.list=list
        console.log(this.item,list)
      })
  }else{
    console.log(this.item)
    this.list=this.item
  }
  
    
  }
  modificar(){
    this.list["key"]=this.item.iddietas
    this.navCtrl.push(AdmModdietaPage,this.list)
  }
}
