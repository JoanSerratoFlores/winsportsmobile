import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { ChatService } from '../services/chat.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  userForm: FormGroup;
  user = this.api.getCurrentUser();
  posts = [];

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router:Router,
    private chatserv:ChatService

  ) {    }

  ngOnInit() {

    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['',Validators.required],
      password: ['', Validators.required]
    });

  }
  
  signUp() {

    this.chatserv.signup({email:this.userForm.value.email,password:this.userForm.value.password}).then(res=>{
      if(res.user.uid){
        let data = {
          email:this.userForm.value.email,
          password:this.userForm.value.password,
          name:this.userForm.value.username,
          uid:res.user.uid
        }
        this.chatserv.saveDetails(data).then(res=>{
        },err=>{
          console.log(err);
        })
      }
    },err=>{
      alert(err.message);

      console.log(err);
    })

    this.api.signUp(this.userForm.value.username, this.userForm.value.email, this.userForm.value.password).subscribe(
      async res => {
          const toast = await this.toastCtrl.create({
            message: res['message'],
            duration: 3000
          });
          toast.present();
          this.router.navigateByUrl("/login")
      },
      err => {
        this.showError(err);
      }
    );
  }

  async showError(err) {
    const alert = await this.alertCtrl.create({
      header: err.error.code,
      message: err.error.message,
      buttons: ['OK']
    });
    await alert.present();
  }

}
