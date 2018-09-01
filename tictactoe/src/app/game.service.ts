import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable'; 
import 'rxjs/add/operator/map';

@Injectable()
export class GameService {

  private updateMoveUrl = "http://localhost:3000/updateMove";
  private getMoveUrl = "http://localhost:3000/getMove";

  constructor(private http: Http) { }

  public getMove(gameId: string): Observable<any>{
    return this.http.get(this.getMove+"?gameId="+gameId)
    .map(res => res)
  }
}
