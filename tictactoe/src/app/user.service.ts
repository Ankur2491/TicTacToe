import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable'; 
import { Challenge } from './models/challenge';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
  private publicIP = "119.82.120.145";
  private getChallengeUrl = "http://"+this.publicIP+":9003/getChallenge";
  private postChallengeUrl = "http://"+this.publicIP+":9003/postChallenge";
  private initializeGameUrl = "http://"+this.publicIP+":9003/initializeGame";
  private getOnlineUsersUrl = "http://"+this.publicIP+":9003/onlineUsers";
  private getGameUrl = "http://"+this.publicIP+":9003/getGame";
  private updateMoveUrl = "http://"+this.publicIP+":9003/updateMove";
  private finishGameUrl = "http://"+this.publicIP+":9003/finishGame";
  private clearGameUrl = "http://"+this.publicIP+":9003/clearGame";
  private signoutUrl = "http://"+this.publicIP+":9003/signout";

  constructor(private http: Http) { }

  public getChallenge(id: string): Observable<any>{
    return this.http.get(this.getChallengeUrl+"?id="+id)
    .map(res => res)
  }
  public postChallenge(challenge: Challenge): Observable<any>{
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const opts: RequestOptions = new RequestOptions();
    opts.headers = headers;
    return this.http.post(this.postChallengeUrl,challenge,opts).map(res=>res);
  }

  public initializeGame(gameObject: Object): Observable<any>{
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const opts: RequestOptions = new RequestOptions();
    opts.headers = headers;
    return this.http.post(this.initializeGameUrl,gameObject,opts).map(res=>res);
  }

  public getOnlineUsers(id: string): Observable<any>{
    return this.http.get(this.getOnlineUsersUrl+"?userId="+id)
    .map(res=>res)
  }

  public getGame(gameId: string): Observable<any>{
    return this.http.get(this.getGameUrl+"?gameId="+gameId)
    .map(res=>res)
  }

  public updateMove(updateObj: object): Observable<any>{
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const opts: RequestOptions = new  RequestOptions();
    opts.headers = headers;
    return this.http.post(this.updateMoveUrl,updateObj,opts).map(res=>res);    
  }
  public finishGame(obj: object): Observable<any>{
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const opts: RequestOptions = new  RequestOptions();
    opts.headers = headers;
    return this.http.post(this.finishGameUrl,obj,opts).map(res=>res);
  }
  public clearGame(gameId: string): Observable<any>{
    return this.http.get(this.clearGameUrl+"?gameId="+gameId)
    .map(res=>res);
  }

  public signout(uid: string): Observable<any>{
    return this.http.get(this.signoutUrl+"?uid="+uid)
    .map(res=>res);
  }
}
