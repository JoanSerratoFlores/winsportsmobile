import { BehaviorSubject } from 'rxjs';
import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  user = this.api.getCurrentUser();
    
  constructor(
    private api: ApiService,

  ) {}

  ngOnInit() {
    
  }

}
