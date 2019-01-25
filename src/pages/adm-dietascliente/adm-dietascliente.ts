import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , LoadingController } from 'ionic-angular';
import { DetalledietaPage } from '../detalledieta/detalledieta';
import { AdmCreardietaclientePage } from '../adm-creardietacliente/adm-creardietacliente';

import { DietasProvider } from '../../providers/dietas/dietas';
//falta terminar
@IonicPage()
@Component({
  selector: 'page-adm-dietascliente',
  templateUrl: 'adm-dietascliente.html',
})
export class AdmDietasclientePage {
  key
  items=[]
  ejers={}
    constructor(public navCtrl: NavController, 
      public navParams: NavParams ,
      public dieta:DietasProvider,
      public loadCtr:LoadingController
      ) {
        this.key=navParams.data
    }
    
  
    ionViewDidLoad() {
      console.log('ionViewDidLoad RutinasPage');
      this.listadietas()
    }
  
    crear(){
      this.navCtrl.push(AdmCreardietaclientePage,this.key)
    }
    listadietas(){
    
        this.dieta.verDietasins(this.key)
        .subscribe(list=>{
          list.forEach(element => {
            element.fechaini=this.convertirfecha(element.fechaini)
            element.fechafin=this.convertirfecha(element.fechafin)
            this.ejers[element.key]=[]
            element["estadohiide"]=false

          });
          this.items=list
          console.log(list,this.key)
        })
    }
    convertirfecha(timestamp){
      let fecha=timestamp.toDate()
      return fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear()
    }
    verejercicios(item){
      
    item["estadohiide"]=!item["estadohiide"]
      //this.navCtrl.push(EjerciciosPage,key)
      
      if(this.ejers[item.key].length==0){
        this.dieta.verdietasasignadas(item.key)
        .subscribe(list=>{
          this.ejers[item.key]=list
          console.log(list,item)
        })
      }
      
    }
    verDetEjercicio(item){
        this.navCtrl.push(DetalledietaPage,item)
    }
  
  }
