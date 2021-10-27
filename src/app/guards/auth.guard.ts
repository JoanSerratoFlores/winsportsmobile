import { AlertController } from '@ionic/angular';
import { ApiService } from './../services/api.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router:Router,private api:ApiService,private alertctrl:AlertController){}

  canActivate(route: ActivatedRouteSnapshot){
    const expectedRole=route.data.role;
    console.log('expected: ',expectedRole)
    
    return this.api.userv.pipe(
      take(1),
      map(user=>{
        console.log('log: ',user)
        if(user){
          let role = user['role'];
          if(expectedRole == role){            
            return true;
          }else{
            this.showalert()
            return this.router.parseUrl('/')
          }
        }else{
          this.showalert()
          return this.router.parseUrl('/')
        }
      })
    )
  }

  async showalert(){
    let alert = await this.alertctrl.create({
      header:'Unauthorized',
      message:'You are not authorized to visit this page',
      buttons:['OK']
    });
    alert.present();
  }

}
