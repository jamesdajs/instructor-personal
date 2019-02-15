import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController } from 'ionic-angular';

import { finalize } from 'rxjs/operators';
//import { Observable } from 'rxjs';
import { Camera,CameraOptions } from '@ionic-native/camera';

import { DietasProvider } from "../../providers/dietas/dietas"
import { AdmTipodietaPage } from "../adm-tipodieta/adm-tipodieta"
import { AngularFireStorage } from 'angularfire2/storage';
/**
 * Generated class for the AdmModdietaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-moddieta',
  templateUrl: 'adm-moddieta.html',
})
export class AdmModdietaPage {
  datos={
    nombre:"",
    descorta:"",
    deslarga:"",
    tipo:"",
    imagen:"",
    key:""
  }
  imagen64=""
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl:ToastController,
    private loadCtrl:LoadingController,
    private dieta:DietasProvider,
    private camera:Camera,
    private storage:AngularFireStorage
    ) {
    this.datos=navParams.data
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmModejercicioPage');
    
  }
  borrarimg(){
    this.imagen64=''
  }
  guardar(){
    
    if(this.datos.nombre==""||this.datos.descorta==""||this.datos.deslarga==""||this.datos.tipo=="")
    {this.toastCtrl.create({
      message: 'tiene q llenar todos los datos',
      duration: 3000}).present()
    }else{
      let load=this.loadCtrl.create({
          content: "Modificando datos...",
        })
        load.present()
      const toast = this.toastCtrl.create({
        message: 'Se modifico correctamente la dieta',
        duration: 3000})
      ////falta modificar
      let key=this.datos.key
      
      delete this.datos.key
      this.dieta.modificarDieta(key,this.datos)
      .then(res=>{
        //console.log(res)
        this.dieta.listaDietas_dietas(key)
        .subscribe(data=>{
          let funciones=[]
          data.forEach(element => {
            funciones.push(
              this.dieta.modificardietasDietas_dietas(
                element.key,
                  {nombre:this.datos.nombre,
                  tipo:this.datos.tipo,
                  descorta:this.datos.descorta,
                  imagen:this.datos.imagen
            }))
          });
          
          Promise.all(funciones)
        })
        if(this.imagen64!=''){
          this.uploadImgB64("dietas/"+key,this.imagen64).then(url=>{
            
            this.dieta.añadirfotoDieta(key,{imagen:url})
            .then(()=>{
              load.dismiss()
              toast.present()
              this.navCtrl.pop()
            })
              load.dismiss()
              toast.present()
              this.navCtrl.setRoot(AdmTipodietaPage)
            
          })
        }else{
          load.dismiss()
          toast.present()
          this.navCtrl.setRoot(AdmTipodietaPage)
        }
      })
      .catch(err=>{
        console.log(err)

      })
    }
  }
  //sibir foto
  seleccionarImagen(){
    const options: CameraOptions = {
      quality:75,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit:true,
      targetHeight:300,
      targetWidth:300,

    }
     
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.imagen64=base64Image;
    }, (err) => {
     // Handle error
    });
    
  }

  uploadImgB64(path:string,imageB64):Promise<any>{
    return new Promise((resolve, reject)=>{
      let ref=this.storage.ref(path)
      let task= ref.putString(imageB64,'data_url');
      task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(data=>{
            console.log(data);
            resolve(data)
          })
        } )
    )
    .subscribe()
      });
  }
}
