import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController,AlertController,ToastController } from 'ionic-angular';
import { RutinaProvider} from '../../providers/rutina/rutina'
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
    private alertCtrl:AlertController,
    private toastCtrl:ToastController
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
      let alert = this.alertCtrl.create({
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
      alert.present();
    }

    

  }

}
