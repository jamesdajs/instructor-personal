import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , LoadingController } from 'ionic-angular';
import { DetallejercicioPage } from '../detallejercicio/detallejercicio';
import { AdmCrearrutinaclientePage } from '../adm-crearrutinacliente/adm-crearrutinacliente';

import { RutinaProvider } from '../../providers/rutina/rutina';

import { Storage } from '@ionic/storage';
/**
 * Generated class for the AdmRutinasclientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-rutinascliente',
  templateUrl: 'adm-rutinascliente.html',
})
export class AdmRutinasclientePage {
key
items=[]
ejers={}
  constructor(public navCtrl: NavController, 
    public navParams: NavParams ,
    public rutina:RutinaProvider,
    public loadCtr:LoadingController,
    public store:Storage
    ) {
      this.key=navParams.data
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad RutinasPage');
    this.listarutinas()
  }

  crear(){
    this.navCtrl.push(AdmCrearrutinaclientePage,this.key)
  }
  listarutinas(){
  
      this.rutina.verRutinasins(this.key)
      .subscribe(list=>{
        list.forEach(element => {
          element.fechaini=this.convertirfecha(element.fechaini)
          element.fechafin=this.convertirfecha(element.fechafin)
          this.ejers[element.key]=[]
        });
        this.items=list
        console.log(list,this.key)
      })
  }
  convertirfecha(timestamp){
    let fecha=timestamp.toDate()
    return fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear()
  }
  verejercicios(key){
    //this.navCtrl.push(EjerciciosPage,key)
    if(this.ejers[key].length==0){
      this.rutina.verEjercicios(key)
      .subscribe(list=>{
        this.ejers[key]=list
        console.log(list)
      })
    }else{
      this.ejers[key]=[]
    }
    
  }
  verDetEjercicio(item){
      this.navCtrl.push(DetallejercicioPage,item)
  }

}

