import { ApiService } from './../services/api.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular';
import firebase from 'firebase/compat/app';


@Component({
  selector: 'app-admin-chat',
  templateUrl: './admin-chat.page.html',
  styleUrls: ['./admin-chat.page.scss'],
})
export class AdminChatPage implements OnInit {

  uid;
  name;
  username;
  users=[];

  constructor(

    public fa: AngularFireAuth,
    public fs: AngularFirestore,
    private navc:NavController,
    private api:ApiService
  ) {

    this.uid = localStorage.getItem("uid");

    firebase.firestore().collection("users").doc(this.uid).get().then(userData => {
      this.name = userData.data()['displayName'];
      this.username = userData.data()['email'];
    });

    firebase.firestore().collection("users").get().then(userData => {
      userData.forEach(childData => {
        if(childData.data()["uid"] != this.uid){
          this.users.push(childData.data())
        }
      });
    });
    
  }

  ngOnInit() {
  }

  gotoChat(uid,displayName){

    sessionStorage.setItem("uid",uid);
    sessionStorage.setItem("name",displayName);
    this.navc.navigateForward("/chat-room")

  }

  signout(){
    this.api.logout()
  }


}
