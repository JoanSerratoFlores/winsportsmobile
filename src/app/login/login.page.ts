import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  userForm: FormGroup;
  user = this.api.getCurrentUser();
  posts = [];

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router:Router
  ) {    }

  ngOnInit() {

    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: '',
      password: ['', Validators.required]
    });

  }
  
  login() {
    this.api.signIn(this.userForm.value.username, this.userForm.value.password).subscribe(
      res => {
        console.log("logeado")
        this.router.navigateByUrl("/tabs")
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
