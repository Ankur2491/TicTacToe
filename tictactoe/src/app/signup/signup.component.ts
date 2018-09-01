import { Component, OnInit } from '@angular/core';
import { Http, Response, RequestOptionsArgs, RequestOptions, Headers } from '@angular/http';
import {
  FormBuilder,
  FormGroup
  } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  userData: Object;
  data: Object;
  loading: boolean;
  isSuccess = false;
  isFailure = false;
  constructor(private http: Http){}

  ngOnInit() {
  }

  onSubmit(form: any): void {
    var self = this
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const opts: RequestOptions = new RequestOptions();
    opts.headers = headers;
    let sampleData = form;
    this.http.post('http://localhost:3000/register',sampleData,opts)
    .subscribe((res: Response) => {
      self.data = JSON.parse(res['_body']);
      //console.log("DATA: ",self.data['isAlreadyRegistered']);
      this.isFailure = self.data['exists'];
      this.isSuccess = !self.data['exists'];
      })
    }

}
