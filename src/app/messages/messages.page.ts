import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import firebase from 'firebase/compat/app';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  uid;
  name;
  username;
  users=[];

  constructor(

    public fa: AngularFireAuth,
    public fs: AngularFirestore,
    private chatserv: ChatService,
    private navc:NavController,

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

}
