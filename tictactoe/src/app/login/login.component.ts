import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router'; 
import { Http, Response, RequestOptionsArgs, RequestOptions, Headers } from '@angular/http';
import { AppRoutingModule } from '../app-routing.module';
import { DataService } from '../data.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as $ from 'jquery';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit{
  message: string;
  loginData: Object;
  redirect: string;
  isLoggedIn: boolean;
  isFailure: boolean;
  isSuccess: boolean;
  @Output() messageEvent = new EventEmitter();
  constructor(private http: Http, public router: Router,private data: DataService, private spinner: Ng4LoadingSpinnerService) { }
  ngOnInit(){}
  
  onSubmit(loginForm: any): void {
    console.log("Inside LoginForm");
    var self = this
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const opts: RequestOptions = new RequestOptions();
    opts.headers = headers;
    let sampleData = loginForm;
    self.messageEvent.emit(true);
    this.http.post('http://119.82.120.145:9003/login',sampleData,opts)
    .subscribe((res: Response) => {
      console.log("LOG::",res);
      self.loginData = JSON.parse(res['_body']);
      if(self.loginData["isValid"]){
        console.log("DATA::",self.loginData);
        let navigationExtras: NavigationExtras = {
          queryParams: {
            "firstName": "Ankur",
            "lastName": "Sharma"
          }
        };
        //navigationExtras['data'] = self.loginData;
        this.redirect = "/home";
        self.isLoggedIn = true;
        //let userData = {"name":"Ankur"}
        sessionStorage.setItem("data",JSON.stringify(self.loginData));  
        // Redirect the user
        //console.log("Valid::",typeof(self.isLoggedIn));
        this.data.changeMessage("true")
        this.router.navigate([this.redirect]);

      }
      });
    }

    signup(form: any): void {
      console.log("Inside Signup");
      var self = this
      const headers: Headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const opts: RequestOptions = new RequestOptions();
      opts.headers = headers;
      let sampleData = form;
      this.http.post('http://119.82.120.145:9003/register',sampleData,opts)
      .subscribe((res: Response) => {
        self.data = JSON.parse(res['_body']);
        //console.log("DATA: ",self.data['isAlreadyRegistered']);
        this.isFailure = self.data['exists'];
        this.isSuccess = !self.data['exists'];
        //$('#signupModal').modal('toggle');
        //this.router.navigate(["/"]);
        })
      }

      clicked(){
        this.router.navigate(["/"]);
      }
}
