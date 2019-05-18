
import { Injectable } from '@angular/core';

import { Cliente,firebaseConfig } from "../../app/app.config";
import { AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument 
  
} from "angularfire2/firestore";
import { Observable } from 'rxjs/Observable';

import {AngularFireAuth} from '@angular/fire/auth';
import { AngularFireStorage } from 'angularfire2/storage';

import { map } from "rxjs/operators";

//import * as firebase from "firebase";
/*
  Generated class for the UsuarioProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UsuarioProvider {
  cliente: AngularFirestoreCollection<Cliente>;

  private clientedoc: AngularFirestoreDocument<Cliente>;
  constructor(
    private db:AngularFirestore,
    private store:AngularFireStorage,
    private authfb:AngularFireAuth
    ) {
    console.log('Hello UsuarioProvider Provider');
    this.cliente = db.collection<Cliente>(firebaseConfig.cliente_endpoint);
  }
  versihaysolicitud(idins){
    let query=res=>res.where("idcliente","==",this.authfb.auth.currentUser.uid)
                      .where("idinstructor","==",idins)
                      .where("rol","==","cliente")
    return this.getcollArrayconkey("instructor_cliente",query)
  }
  verMissolicitud(estado,rol){
    let query=res=>res.where("idinstructor","==",this.authfb.auth.currentUser.uid)
                      .where("estado","==",estado)
                      .where("rol","==",rol)
    return this.getcollArrayconkey("instructor_cliente",query)
  }
  modificarinstructor_cliente(id,data){
    return this.db.collection("instructor_cliente").doc(id).set(data,{ merge: true })
  }
  addcliente(cli){
    this.cliente.add(cli)
  }
  crearusuario(id,data){
    return this.db.collection("cliente").doc(id).set(data,{ merge: true })
  }
  modusuario(data){
    return this.db.collection("cliente").doc(this.authfb.auth.currentUser.uid).set(data,{ merge: true })
  }
  private getcollArrayconkey(coll,query?):Observable<any>{
    return this.db.collection(coll,query)
    .snapshotChanges().pipe(map(change=>{
      return change.map(c=>({key:c.payload.doc.id, ...c.payload.doc.data()}))
    }))
  }
  private getcollArrayconkeyPromise(coll,query?):Promise<any>{
    return new Promise((res,rej)=>{
        this.getcollArrayconkey(coll,query)
        .subscribe(data=>res(data))
    })
    
  }
  
  buscarinstuctor(buscar){
    let query=res=>res.where("instructor","==",true)
                      .orderBy('fullname')
                      .startAt(buscar)
                      .limit(10)
    return this.getcollArrayconkey("cliente",query)
  }
  verMisinstuctor(){
    let query=res=>res.where("idcliente","==",this.authfb.auth.currentUser.uid)
                      .where("estado","==",true)
                      .where("rol","==","instructor")
    return this.getcollArrayconkey("instructor_cliente",query)
  }
  verMisinstuctorPronesa(){
    let query=res=>res.where("idcliente","==",this.authfb.auth.currentUser.uid)
    return new Promise((res,rej)=>{
      this.getcollArrayconkey("instructor_cliente",query)
      .subscribe(data=>{
        res(data)
      },rej)
    })
    
  }
  updateTask(id, update) {
 
    this.clientedoc = this.db.doc<Cliente>(`${firebaseConfig.cliente_endpoint}/${id}`);
 
    this.clientedoc.update(update);
 
 }
 veriduser(){
  return Promise.resolve(this.authfb.auth.currentUser.uid)
}
guardarSolicitud(data){
  return this.db.collection("instructor_cliente").add(data)
}
verSitienenDatos() {
  return new Promise((resolve, reject) => {
    this.db.collection("cliente").doc(this.authfb.auth.currentUser.uid).valueChanges()
     .subscribe((response: any) => {
        resolve(response); 
      }, reject); 
    })
  }
  VerSiestaLogeado(){
    return  new Promise(resolve=>{

      this.authfb.auth.onAuthStateChanged(function(user) {
        if (user) {
          resolve(true)
        }else{
          resolve(false)
        }
      })
    })
  }
 deleteTask(id) {

  //Get the task document

  this.clientedoc = this.db.doc<Cliente>(`${firebaseConfig.cliente_endpoint}/${id}`);

  //Delete the document

  this.clientedoc.delete();

}
  private getArrayconkey():Observable<any>{
    return this.db.collection<Cliente>(firebaseConfig.cliente_endpoint,res => {
      return res.where("genero", "==", true)
    })
    .snapshotChanges().pipe(map(change=>{
      return change.map(c=>({key:c.payload.doc.id, ...c.payload.doc.data()}))
    }))
  }
  leerdatos(){
    return this.getArrayconkey()
  }
  leermisdatos(){
    
    return this.db
    .doc<Cliente>(`${firebaseConfig.cliente_endpoint}/${this.authfb.auth.currentUser.uid}`)
    .valueChanges()
    //this.db.collection('cliente').doc("OwURqGHpPggxLbTlKp0L").valueChanges()
    
  }
  guardarrutinacliente(keycli,datos){
    datos["idinstructor"]=this.authfb.auth.currentUser.uid
    datos["estado"]=false
    return this.db.collection(`cliente/${keycli}/rutinas`).add(datos)
  }
  modrutinacliente(keycli,idrut,datos){
    
    return this.db.collection(`cliente/${keycli}/rutinas`).doc(idrut).set(datos,{ merge: true })
  }
  moddietacliente(keycli,iddieta,datos){
    
    return this.db.collection(`cliente/${keycli}/dietas`).doc(iddieta).set(datos,{ merge: true })
  }
  guardarrutinaDefecto(datos){
    datos["estado"]=true
    return this.db.collection(`cliente/${this.authfb.auth.currentUser.uid}/rutinasdefecto`).add(datos)
  }
  guardarRutina_ejercicio(data){
    return this.db.collection(`rutina_ejer`).add(data)
  }
  eliminarRutina_ejercicio(idrut_ejer){
    return this.db.collection(`rutina_ejer`).doc(idrut_ejer).delete()
  }
  eliminarDieta_dietas(iddie_dietas){
    return this.db.collection(`dietas_dieta`).doc(iddie_dietas).delete()
  }
  modificarRutina_ejercicio(key,data){
    return this.db.collection(`rutina_ejer`).doc(key).set(data,{ merge: true })
  }
  listarRutina_ejercicio(keyruttina){
    let query=res=>res.where("idrutina","==",keyruttina)
                      
    return this.getcollArrayconkey(`rutina_ejer`,query)
  }
  listardieta_dietas(keydieta){
    let query=res=>res.where("iddietacli","==",keydieta)
                      
    return this.getcollArrayconkey(`dietas_dieta`,query)
  }
  guardarRutina_cliente(data){
    return this.db.collection(`instructor_cliente`).add(data)
  }
  modrDietacliente(keycli,idrut,datos){
    return this.db.collection(`cliente/${keycli}/dietas`).doc(idrut).set(datos,{ merge: true })
  }
  guardarDietacliente(keycli,datos){
    datos["idinstructor"]=this.authfb.auth.currentUser.uid
    datos["estado"]=false
    return this.db.collection(`cliente/${keycli}/dietas`).add(datos)
  }
  guardarDietas_dieta(data){
    return this.db.collection(`dietas_dieta`).add(data)
  }
  datosCliente(id){
    
    return this.db
    .doc<Cliente>(`${firebaseConfig.cliente_endpoint}/${id}`)
    .valueChanges()
    //this.db.collection('cliente').doc("OwURqGHpPggxLbTlKp0L").valueChanges()
    
  }
  leerOtrosdatos(datos){
    
    return this.db
    .doc<Cliente>(`${firebaseConfig.cliente_endpoint}/${datos}`)
    .valueChanges()
    //this.db.collection('cliente').doc("OwURqGHpPggxLbTlKp0L").valueChanges()
    
  }
  creardatosInstructor(datos){
    return this.db.collection(`${firebaseConfig.cliente_endpoint}/${this.authfb.auth.currentUser.uid}/instructor`)
    .doc("modo_instructor").set(datos,{ merge: true })
  }
  modificardatocli(id,data){
    return this.db.collection("instructor_cliente").doc(id).set(data,{ merge: true })
  }
  leerOtrosdatosinstructor(datos):any{
    
    return this.db
    .doc(`${firebaseConfig.cliente_endpoint}/${datos}/instructor/modo_instructor`)
    .valueChanges()
    //this.db.collection('cliente').doc("OwURqGHpPggxLbTlKp0L").valueChanges()
    
  }
  leerMisdatosinstructor():any{
    
    return this.db
    .doc(`${firebaseConfig.cliente_endpoint}/${this.authfb.auth.currentUser.uid}/instructor/modo_instructor`)
    .valueChanges()
    //this.db.collection('cliente').doc("OwURqGHpPggxLbTlKp0L").valueChanges()
    
  }
  leermisdatosPromesa():Promise<Cliente>{
    
    return new Promise((res,rej)=>{
      this.db
      .doc<Cliente>(`${firebaseConfig.cliente_endpoint}/${this.authfb.auth.currentUser.uid}`)
      .valueChanges()
      .subscribe(datos=>{
        res(datos)
      },rej)
    })
    
    //this.db.collection('cliente').doc("OwURqGHpPggxLbTlKp0L").valueChanges()
    
  }
  encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux:any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL);
    };
    img.src = imageUri;
  };

  uploadImage(imageURI){
    return new Promise<any>((resolve, reject) => {
      let storageRef = this.store.ref("cliente/juan")
      this.encodeImageUri(imageURI, function(image64){
        storageRef.putString(image64, 'data_url')
        .then(snapshot => {
          resolve(snapshot.downloadURL)
        }, err => {
          reject(err);
        })
      })
    })
}
crearPublicasion(datos){
  datos["idcliente"]=this.authfb.auth.currentUser.uid
  return this.db.collection(`publicaciones`).add(datos)
}
modPublicasion(key,datos){
  return this.db.collection(`publicaciones`).doc(key).set(datos,{ merge: true })
}
eliminarPublicasion(key){
  return this.db.collection(`publicaciones`).doc(key).delete()
}
listarPublicasion(num){
  let query = res=>res.orderBy('fecha','desc').limit(num)   
    return this.getcollArrayconkey(`publicaciones`,query)
}
listarMisPublicasion(){
  let query=res=>res.where("idcliente","==",this.authfb.auth.currentUser.uid)
                          
  return this.getcollArrayconkey(`publicaciones`,query)
}
listarPublicasionid(keyins,limit){  
  let query=res=>res.where("idcliente","==",keyins)
          .orderBy('fecha','desc').limit(limit) 
                          
  return this.getcollArrayconkey(`publicaciones`,query)
}
cambiarEstadoPublicasion(){  
  let query=res=>res.where("idcliente","==",this.authfb.auth.currentUser.uid)
                    .where("estado","==",true)
                          
 return this.getcollArrayconkeyPromise(`publicaciones`,query)
  .then(res=>{
    
    if(res.length!=0) return this.modPublicasion(res[0].key,{estado:false})
  })
}
guardarhorario(datos){
    
    return this.db.collection(`cliente/${this.authfb.auth.currentUser.uid}/horario`).doc("horario").set(datos,{ merge: true })
}
}
