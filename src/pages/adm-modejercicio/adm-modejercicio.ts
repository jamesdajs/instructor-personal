import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController } from 'ionic-angular';

import { finalize } from 'rxjs/operators';
//import { Observable } from 'rxjs';
import { Camera,CameraOptions } from '@ionic-native/camera';

import { RutinaProvider } from "../../providers/rutina/rutina"
import { AdmTipoejercicioPage } from "../adm-tipoejercicio/adm-tipoejercicio"
import { AngularFireStorage } from 'angularfire2/storage';
import { ImagePicker } from '@ionic-native/image-picker';
import { File } from '@ionic-native/file';
import { Crop } from '@ionic-native/crop';
/**
 * Generated class for the AdmModejercicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-modejercicio',
  templateUrl: 'adm-modejercicio.html',
})
export class AdmModejercicioPage {
  datos={
    nombre:"",
    descorta:"",
    deslarga:"",
    tipo:"",
    imagen:"",
    imagen1:"",
    key:"",
    linkyoutube:"",
    rol:true,
    imagenes:[]
  }
  imagen64=""
  imagen64_2=''
  imgCropUrl=[]
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl:ToastController,
    private loadCtrl:LoadingController,
    private rutina:RutinaProvider,
    private camera:Camera,
    private storage:AngularFireStorage,
    private imagePicker:ImagePicker,
    private file:File,
    private cropService:Crop
    ) {
    this.datos=navParams.data
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmModejercicioPage');
    console.log(this.datos)
    
  }
  borrarimg(){
    this.imagen64=''
  }
  borrarimg2(){
    this.imagen64_2=''
  }
  guardar(){
    //modificar nombre descorta y tipo en rutina_ejer
    
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
        message: 'Se modifico correctamente el ejericicio',
        duration: 3000})
      ////falta modificar
      let key=this.datos.key
      
      delete this.datos.key
      delete this.datos.rol

      this.rutina.modificarEjercicio(key,this.datos)
      .then(res=>{
        //console.log(res)
        this.rutina.listaRutinas_ejer(key)
        .subscribe(data=>{
          let funciones=[]
          data.forEach(element => {
            funciones.push(this.rutina.modificarEjercicioRutina_ejer(element.key,{nombre:this.datos.nombre,
                                                                                  tipo:this.datos.tipo,
                                                                                  descorta:this.datos.descorta
            }))
          });
          Promise.all(funciones)
          
        })
        if(this.imagen64!=''){
          this.uploadImgB64("ejercicios/"+key,this.imagen64).then(url=>{
            this.rutina.añadirfotoEjercicio(key,{imagen:url})
            .then(()=>{
                          
              load.dismiss()
              toast.present()
              this.navCtrl.setRoot(AdmTipoejercicioPage)
            })

            
          })
        }else if(this.imagen64_2!=''){
          this.uploadImgB64("ejercicios/"+key+'1',this.imagen64_2).then(url=>{
            this.rutina.añadirfotoEjercicio(key,{imagen1:url})
            .then(()=>{
            
              load.dismiss()
              toast.present()
              this.navCtrl.setRoot(AdmTipoejercicioPage)
            })
            
          })
        }else{
          load.dismiss()
          toast.present()
          this.navCtrl.setRoot(AdmTipoejercicioPage)
        }
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
  seleccionarImagen2(){
    const options: CameraOptions = {
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
     this.imagen64_2=base64Image;
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
  openImagePickerCrop(){
    this.imagePicker.hasReadPermission()
    .then((result) => {
      if(result == false){
        // no callbacks required as this opens a popup which returns async    
        this.imagePicker.requestReadPermission();
      }
      else if(result == true){
        this.imagePicker.getPictures({
          
          maximumImagesCount: 5,
          quality:25
        })
        .then(async (results) => {
          this.imgCropUrl=[]
          for (var i = 0; i < results.length; i++) {
            
            let imageData= await this.cropService.crop(results[i])
            let objres = await this.procesandoCrop(imageData)
            this.imgCropUrl.push(objres)
          }
        })
            
      }
    })
    .catch(err=>{
      alert(JSON.stringify(err))
    })
    
  }
  procesandoCrop(imageData){
    return new Promise((res,rej)=>{
       this.file.resolveLocalFilesystemUrl(imageData)
       .then(newurlImage=>{
        let dirpath=newurlImage.nativeURL
            let dirpathseg=dirpath.split("/")
            dirpathseg.pop()
            dirpath=dirpathseg.join('/')
            //alert(dirpath)
            this.file.readAsArrayBuffer(dirpath,newurlImage.name)
            .then(buffer=>{
              //alert(buffer.byteLength)
              let blob=new Blob([buffer],{type:"image/jpg"})

              var reader  = new FileReader();
              reader.readAsDataURL(blob);
                reader.onloadend = function () {
                  res({
                    base64:reader.result,
                    url:newurlImage.nativeURL,
                    nombre:newurlImage.name,
                    blob:blob
                  })
              }
           })
          })
      })
  }
  uploadImageToFirebase(path,objres){
    return new Promise((resolve, reject)=>{
          //alert(newUrl)
            let ref=this.storage.ref(path+objres.nombre)
            let task= ref.put(objres.blob)
            task.snapshotChanges().pipe(
              finalize(() => {
                ref.getDownloadURL().subscribe(data=>{
                  //alert(data);
                  resolve(data)
                })
                
              } )
          )
          .subscribe()
      })
}
}
