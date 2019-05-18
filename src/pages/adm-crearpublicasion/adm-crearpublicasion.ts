import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController,ToastController } from 'ionic-angular';
import { finalize } from 'rxjs/operators';
import { Camera,CameraOptions } from '@ionic-native/camera';

import { AngularFireStorage } from '@angular/fire/storage';
import {UsuarioProvider} from '../../providers/usuario/usuario'
import { FormGroup, FormBuilder ,Validators} from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import {File} from "@ionic-native/file"
//import { DomSanitizer } from '@angular/platform-browser';

import { PhotoViewer } from '@ionic-native/photo-viewer';
import { WheelSelector } from '@ionic-native/wheel-selector';
import { Geolocation } from '@ionic-native/geolocation';
declare var google: any;
//import { IonicImageLoader } from 'ionic-image-loader';
/**
 * Generated class for the AdmCrearpublicasionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-crearpublicasion',
  templateUrl: 'adm-crearpublicasion.html',
})
export class AdmCrearpublicasionPage {
  imagen64=""
  datos={
    comentario:"",
    titulo:"",
    costo:0,
    semanas:"",
    horas:"",
    fecha:new Date,
    estado:true,
    moneda:'dolares',
    direccion:'',
    coordenadas:{
      lat:'',
      lng:'',
      zoom:''
    }
  }


  myForm:FormGroup
  imgCropUrl=[]
  imgurlsaf
  dummyJson = {
    
    semanas:[
        { description: 'Horas', value: '' }
      ],
      horas:[
        { description: 'Semanas', value: '' }
      ]
    
  
  }
  constructor(public navCtrl: NavController, public navParams: NavParams ,public camera:Camera,
  
    private storage:AngularFireStorage,
    private loadCtrl:LoadingController,
    private toastCtrl:ToastController,
    private user:UsuarioProvider,
    private formb : FormBuilder,
    private imagePicker:ImagePicker,
    private cropService:Crop,
    private file:File,
    private photoViewer: PhotoViewer,
    private selector:WheelSelector,
    private toasCtrl:ToastController,
    
    public geolocation:Geolocation
    //private domSanitizer: DomSanitizer
    ) {
      this.datos["nombre"]=navParams.data.nombre
      this.datos["foto"]=navParams.data.foto
      this.datos["telefono"]=navParams.data.telefono
      this.myForm = this.formb.group({
        titulo:['', [Validators.required,Validators.maxLength(100)]],
        costo:['', [Validators.required,Validators.maxLength(4)]],
        comentario: ['', [Validators.required,Validators.maxLength(300)]]
      });
      for(let i=1;i<13;i++){
        this.dummyJson.horas.push({ description: i+'', value: ''+i })
        this.dummyJson.semanas.push({ description: i+'', value: ''+i })
      }
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmCrearpublicasionPage');
    this.loadMap()
  }
  seleccionarImagen(){
    const options: CameraOptions = {
      quality:100,
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
  guardar(){
  if(this.myForm.invalid || this.imgCropUrl.length==0)
  {this.toastCtrl.create({
    message: 'Tiene que llenar todos los datos. '+this.imgCropUrl.length,
    duration: 3000}).present()

  }else
    this.user.cambiarEstadoPublicasion()
    .then(()=>{
      
        let load=this.loadCtrl.create({
            content: "Guardando datos...",
          })
          load.present()
        const toast = this.toastCtrl.create({
          message: 'Se creo correctamente  la publicacion',
          duration: 3000})
        
        this.user.crearPublicasion(this.datos)
        .then(res=>{
          //console.log(res)
          let funcImg=[]
          for(let i in this.imgCropUrl){
            funcImg.push(this.uploadImageToFirebase("publicaciones/"+res.id+"/",this.imgCropUrl[i]))
          }
          Promise.all(funcImg)
          .then(arrayurl=>{
            //alert(arrayurl[0] +" "+arrayurl.length)
            let imagenes=[]
            for(let i in arrayurl){
              imagenes.push({url:arrayurl[i],nombre:this.imgCropUrl[i].nombre})
            }
            this.user.modPublicasion(res.id,{imagenes:imagenes})
            .then(()=>{
              load.dismiss()
              toast.present()
              this.navCtrl.pop()

            })
          })
            
          
        }).catch(err=> {
          load.dismiss()
          alert(JSON.stringify(err))
        })
      
    })
    
    
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
          quality:10
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
verimage(path){
  this.photoViewer.show(path)
}
imagenload(e){
  console.log(e)
}

//funciones pa que no la cague


modificarset(){
  
  this.selector.show({
    title: "Duración del curso",
    
    displayKey: 'description',
    items: [
      this.dummyJson.semanas,
      this.dummyJson.horas
    ],
    
    positiveButtonText: "Aceptar",
    negativeButtonText: "Cancelar",

    wrapWheelText:true,
  }).then(
    result => {
      if(this.dummyJson.semanas[result[0].index].value!='' || 
        this.dummyJson.horas[result[1].index].value!=''){
          this.datos.semanas=this.dummyJson.semanas[result[0].index].value
          this.datos.horas=this.dummyJson.horas[result[1].index].value
        }else{
          this.toasCtrl.create({
            message:"Debe colocar un tiempo de duración",
            duration:3000
          }).present()
        }
       },
    err => console.log('Error: ' + JSON.stringify(err))
    )
}
async loadMap()  {
  // This code is necessary for browser
  let latlng={}
  console.log(this.datos)
  if(this.datos.coordenadas.lat==''){
    let resp= await this.geolocation.getCurrentPosition()
    latlng={lat:resp.coords.latitude, lng: resp.coords.longitude}
  }else{
    latlng={lat:this.datos.coordenadas.lat, lng: this.datos.coordenadas.lng}
  }
  let map
    map = new google.maps.Map(document.getElementById('map_publi'), {
      center: latlng,// this.datosins.nombregym+' '+this.datosins.ciudad+' '+this.datosins.departamento,
      zoom: this.datos.coordenadas.lat!=''?this.datos.coordenadas.zoom:12,
      disableDefaultUI: true
    });
    var marker = new google.maps.Marker(
      {
        position:this.datos.coordenadas.lat!=''?latlng:'',
        map: map,
      }
      )
    let geocoder = new google.maps.Geocoder;
    let _datosins=this.datos
      map.addListener('click', function(event) {
        marker.setPosition(event.latLng)
        console.log(event)
        _datosins.coordenadas={
          lat:marker.getPosition().lat(),
          lng:marker.getPosition().lng(),
          zoom:map.getZoom()
        }
        geocoder.geocode({
          'location': event.latLng
        }, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
    
              //alert('place id: ' + results[0].place_id);
              _datosins.direccion=results[0]['formatted_address'];
    
    
            } else {
              console.log('No results found');
            }
          } else {
            console.log('Geocoder failed due to: ' + status);
          }
        });
      });
}
}
