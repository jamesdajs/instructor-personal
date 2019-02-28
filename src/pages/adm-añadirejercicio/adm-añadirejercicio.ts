import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController,ToastController,
ModalController
} from 'ionic-angular';
import { RutinaProvider} from '../../providers/rutina/rutina'

import { AdmSetejercicioPage} from '../adm-setejercicio/adm-setejercicio';
/**
 * Generated class for the AdmAñadirejercicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-aadirejercicio ',
  templateUrl: 'adm-añadirejercicio.html',
})
export class AdmAñadirejercicioPage {
  simpleColumns = [
    {
      name: 'peso',
      options: [
        { text: 'sin peso', value: '' },
        { text: '0.5 kg', value: '0.5' },
        { text: '1 kg', value: '1' },
        { text: '1.5 kg', value: '1.5' },
        { text: '2 kg', value: '2' },
        { text: '2.5 kg', value: '2.5' },
        { text: '3 kg', value: '3' },
        { text: '3.5 kg', value: '3.5' },
        { text: '4 kg', value: '4' },
        { text: '4.5 kg', value: '4.5' },
        { text: '4 kg', value: '5' },
        { text: '5.5 kg', value: '5.5' },
        { text: '6 kg', value: '6' },
        { text: '6.5 kg', value: '6.5' },
        { text: '7 kg', value: '7' },
        { text: '7.5 kg', value: '7.5' },
        { text: '8 kg', value: '8' },
        { text: '8.5 kg', value: '8.5' },
        { text: '9 kg', value: '9' },
        { text: '9.5 kg', value: '9.5' },
        { text: '10 kg', value: '10' }
      ]
    },{
      name: 'pepeticiones',
      options: [
        { text: 'Sin rep.', value: '0' },
        { text: '1', value: '1' },
        { text: '2', value: '2' },
        { text: '3', value: '3' },
        { text: '4', value: '4' },
        { text: '5', value: '5' }
      ]
    },{
      name: 'tiempo',
      options: [
        { text: 'Sin tiempo', value: '' },
        { text: '5 min', value: '5' },
        { text: '10 min', value: '10' },
        { text: '15 min', value: '15' },
        { text: '20 min', value: '20' },
        { text: '25 min', value: '25' },
        { text: '30 min', value: '30' },
        { text: '35 min', value: '35' },
        { text: '40 min', value: '40' },
        { text: '45 min', value: '45' },
        { text: '50 min', value: '50' },
        { text: '55 min', value: '55' },
        { text: '60 min', value: '60' }
      ]
    }
  ]
  
  c1=true
tipoejer=[]
tipodefecto=[
  {nombre:"hombro",estadohiide:false},
  {nombre:"brazos",estadohiide:false},
  {nombre:"piernas",estadohiide:false}
]
ejercicios=[]
ejers={}
ejerselec=[]
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private view:ViewController,
    private rutina:RutinaProvider,
    private toastCtrl:ToastController,
    private modal:ModalController
    ) {
      for(let i=0;i<navParams.data.length;i++){
        this.ejerselec.push(navParams.data[i])
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmAñadirejercicioPage' ,this.navParams.data);
    this.cargardatos()
    console.log(this.navParams.data.length)

  }
  
  dismiss(){
    this.view.dismiss(this.ejerselec)
  }
  borrarselecionado(i,key){

   // this.ejerselec[i].event.checked=false
   
   this.ejerselec.splice(i, 1);

    this.tipodefecto.forEach(tipo=>{
      this.ejers[tipo.nombre].forEach(ejer => {
        if(ejer.key==key){
          ejer.estadoadd=true
          console.log(ejer.key)

        }
      });
    })
    this.tipoejer.forEach(tipo=>{
      this.ejers[tipo.nombre].forEach(ejer => {
        if(ejer.key==key){
          ejer.estadoadd=true
          console.log(ejer.key)

        }
      });
    })
    //console.log(key,this.ejercicios)
  }
  verejercicios(item){
  item["estadohiide"]=!item["estadohiide"]
  if(this.ejers[item.nombre].length==0 ){
    this.rutina.verMisEjercicios(item.nombre)
    .subscribe(list=>{
      list.forEach(element => {
        element["estadoadd"]=true
      });
      list.forEach(element => {
        this.ejerselec.forEach(sel => {
          if(element["key"]==sel["key"])
            element["estadoadd"]=false
        });
      });
      this.ejers[item.nombre]=list
      console.log(list)
    })
  }
  }
  cargardatos(){
    
    this.rutina.listaMisTipoEjercicio()
    .subscribe(data=>{
      this.tipoejer=data
      this.tipoejer.forEach(elem=>{
        this.ejers[elem.nombre]=[]
      })
    })
    //crearkey por tipo
    this.tipodefecto.forEach(elem=>{
      elem["estadohiide"]=false
      this.ejers[elem.nombre]=[]
    })
    
    console.log(this.ejers)
    /*
    this.rutina.verMisEjerciciostodo()
    .subscribe(data=>{
      data.forEach(element => {

            element["estadoadd"]=true
        
      });
      data.forEach(element => {

        this.ejerselec.forEach(sel => {
          if(element["key"]==sel["key"])
            element["estadoadd"]=false
        });
        
      });
      this.ejercicios=data
      //console.log(this.ejercicios)
    })*/
  }
  solicitud(item,i,e?){

    console.log("funcion solicitud")

    if(!item.estadoadd || !e.checked){
      let encontrado=null
      for(let i=0;i<this.ejerselec.length;i++){
        
          if(this.ejerselec[i].key==item.key){
            encontrado=i
            break
          }
      }
      if(encontrado!=null){
        this.ejerselec.splice(encontrado, 1);
        item.estadoadd=true
      }

    }else{
      let profileModal = this.modal.create(AdmSetejercicioPage,item,{enableBackdropDismiss:false});
      profileModal.onDidDismiss((data) => {
        
        console.log(data);
        if(data.length==0){
          this.toastCtrl.create({
            message:"El ejercicio tiene que tener al menos un set",
            duration:3000
          }).present()
          e.checked=false
        }
        else{
          let dato:any={}
                for(let j in item){
                    dato[j]=item[j]
                }
                let peso=[],rep=[],tiempo=[]
                for(let j in data){
                  peso.push(data[j].peso)
                  rep.push(data[j].repeticiones)
                  tiempo.push(data[j].tiempo)
                }

                dato["peso"]=peso
                dato["tiempo"]=tiempo
                dato["repeticiones"]=rep
                dato["idejercicio"]=dato.key
                dato["event"]=e
                item.estadoadd=false
                this.ejerselec.push(dato)
        }
      });
      profileModal.present();
      /*let alert = this.alertCtrl.create({
        title: 'Login',
        inputs: [
          {
            name: 'peso',
            placeholder: 'Peso en kg',
            type:"number",
            min:0,
            max:300
          },
          {
            name: 'repeticiones',
            placeholder: 'Repeticiones',
            type: 'text'
          },
          {
            name: 'duracion',
            placeholder: 'Duracion en min',
            type: 'number',
            min:0,
            max:180
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
              e.checked=false
            }
          },
          {
            text: 'Aceptar',
            handler: data => {
              if(data.peso=="" && data.duracion=="" && data.repeticiones==""){
                this.toastCtrl.create({
                  message:"Tiene que llenar al menos un campo",
                  duration:3000
                }).present()
                return false
              }
              else{
                
                console.log(item,i)
                let dato:any={}
                for(let j in item){
                    dato[j]=item[j]
                }
                dato["peso"]=data.peso
                dato["duracion"]=data.duracion
                dato["repeticiones"]=data.repeticiones
                dato["idejercicio"]=dato.key
                dato["event"]=e
                item.estadoadd=false
                this.ejerselec.push(dato)
              }
            }
          }
        ]
      });
      alert.present();*/
    }

    

  }

}
