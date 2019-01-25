import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,Events ,LoadingController} from 'ionic-angular';

import { DietasProvider } from '../../providers/dietas/dietas'
import { DetalledietaPage } from '../detalledieta/detalledieta'


import { Storage } from '@ionic/storage';
/**
 * Generated class for the DietasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dietas',
  templateUrl: 'dietas.html',
})
export class DietasPage {
items=[]
ejers=[]
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event:Events,
    public dieta:DietasProvider,
    public loadctrl:LoadingController,
    public store:Storage
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DietasPage');
    this.listarDietas()
  }
  verdetalledieta(item){
    this.navCtrl.push(DetalledietaPage,item)
  }
  listarDietas(){
    this.store.get('key1')
    .then(key=>{
      this.dieta.verDietasins(key)
      .subscribe(list=>{
        list.forEach(element => {
          element.fechaini=this.convertirfecha(element.fechaini)
          element.fechafin=this.convertirfecha(element.fechafin)
          this.ejers[element.key]=[]
          element["estadohiide"]=false
  
        });
        this.items=list
        console.log(list,)
      })
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
