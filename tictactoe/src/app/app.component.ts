import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { ActivatedRoute, Params } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { Router, NavigationExtras } from '@angular/router'; 
import { DataService } from './data.service';
import { UserService } from './user.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'TicTacToe!';
  message: string;
  isLoggedIn:boolean;
  userID: string;
  constructor(private data: DataService, private router: Router, private userService: UserService){

  }

  ngOnInit(){
    this.data.currentMessage.subscribe(message => this.isLoggedIn = (message == "true"))
  }
  signout(){
    var usersObj = JSON.parse(sessionStorage.getItem("data"));
    console.log("SESSION_STORAGE::", usersObj);
    this.userID = usersObj["uid"];
    this.userService.signout(this.userID).subscribe(res =>{ 
    });
    sessionStorage.clear();
  }
  
}
