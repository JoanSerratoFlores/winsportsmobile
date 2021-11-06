import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  user = this.api.getCurrentUser().subscribe(res=>{
    console.log(res)
    this.userv=res
  });
  userv

  constructor(    
    private api: ApiService,
    private router:Router
    ) { }

  ngOnInit() {
  }
  logout(){
    this.api.logout();
  }
  terms(){
    this.router.navigateByUrl("/terms")
  }
  privacy(){
    this.router.navigateByUrl("/privacy")
  }
}
