import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';


import { DietasProvider } from '../../providers/dietas/dietas';

@IonicPage()
@Component({
  selector: 'page-adm-asignardietacliente',
  templateUrl: 'adm-asignardietacliente.html',
})
export class AdmAsignardietaclientePage {
  dietas=[]
  dietasselec=[]
  tipodieta=[
    {key:"desgym",nombre:"Despues del Gym",estadohiide:false},
    {key:"desayuno",nombre:"Desayuno",estadohiide:false},
    {key:"merienda",nombre:"Merienda",estadohiide:false},
    {key:"almuerzo",nombre:"Almuerzo",estadohiide:false},
    {key:"cena",nombre:"Cena"}
  ]
  items=[]
  ejers={}
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private view:ViewController,
    private dieta:DietasProvider
    ) {
      this.dietasselec=navParams.data
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmAsignardietaclientePage');
    
    this.listarutinas()
  }
  dismiss(){
    this.view.dismiss(this.dietasselec)
  }
  listarutinas(){
    this.tipodieta.forEach(element => {
        this.ejers[element.key]=[]
      })
}
verejercicios(item){
  //this.navCtrl.push(EjerciciosPage,key)

  item["estadohiide"]=!item["estadohiide"]
  if(this.ejers[item.key].length==0 ){
    this.dieta.verDietasporTipo(item.key)
    .subscribe(list=>{
      list.forEach(element => {
        element["estadoadd"]=true
      });
      list.forEach(element => {
        this.dietasselec.forEach(sel => {
          if(element["key"]==sel["key"])
            element["estadoadd"]=false
        });
      });
      this.ejers[item.key]=list
      console.log(list)
    })
  }
  
}
solicitud(dieta,i){
  let dato:any={}
    for(let j in dieta){
        dato[j]=dieta[j]
    }
    dato["iddietas"]=dato.key
    dieta.estadoadd=false
    this.dietasselec.push(dato)
  console.log(this.dietasselec)

}

}
