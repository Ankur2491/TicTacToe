import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent }  from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { GameComponent } from './game/game.component';


const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent},
  { path: 'game', component: GameComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false // <-- debugging purposes only
      }
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class AppRoutingModule { }
