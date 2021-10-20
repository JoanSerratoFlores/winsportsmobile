import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Storage  } from '@ionic/Storage';
import { JwtInterceptor } from './interceptor/jwt.interceptor';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    
  ],
  
  providers: 
  [
    { 
      provide: RouteReuseStrategy, useClass: IonicRouteStrategy
    },
    {
      provide:HTTP_INTERCEPTORS,useClass:JwtInterceptor,multi:true 
    },
    Storage
  ],
  
  bootstrap: [AppComponent],
})

export class AppModule {}