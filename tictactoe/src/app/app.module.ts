import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

import { Router } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { DataService } from './data.service';
import { UserService } from './user.service';
import { GameService } from './game.service';
import { GameComponent } from './game/game.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    GameComponent
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    Ng4LoadingSpinnerModule.forRoot()
  ],
  providers: [DataService,UserService,GameService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(router: Router){
    //console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
  }
 }
