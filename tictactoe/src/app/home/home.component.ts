import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { Challenge } from '../models/challenge';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AppRoutingModule } from '../app-routing.module';
import { Router, NavigationExtras } from '@angular/router'; 



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  public firstName: string;
  public lastName: string;
  public onlineUsers: string[];
  public userID: string;
  public challengeFrom: string;
  public challengeExists: boolean;
  public gameObject: Object;
  public challengeObject: Object;
  public redirect: string;
  public checkGameInterval: any;
  template: string =`<img src="http://pa1.narvii.com/5722/2c617cd9674417d272084884b61e4bb7dd5f0b15_hq.gif" />`;
  constructor(private route: ActivatedRoute, private userService: UserService, private spinner: Ng4LoadingSpinnerService, private router: Router) {
    // this.route.queryParams.subscribe(params =>{
    //   this.firstName = params["firstName"];
    //   this.lastName = params["lastName"];
    //   console.log("FirstName: "+params["firstName"]+" LastName: "+params["lastName"]);
    // })
    //console.log("sessionStorage: "+sessionStorage.getItem("data"));
    var usersObj = JSON.parse(sessionStorage.getItem("data"));
    console.log("SESSION_STORAGE::", usersObj);
    this.userID = usersObj["uid"];
    this.onlineUsers = usersObj["liveUsers"]
  }

  ngOnInit() {
    setInterval(() => {
      this.getGameChallenge();
    }, 5000);
    setInterval(() => {
      this.getOnlineUsers(this.userID);
    },5000)
  }


  getGameChallenge() {
    this.userService.getChallenge(this.userID).subscribe(res => {
      this.challengeObject = JSON.parse(res["_body"]);
      //console.log(obj);
      //console.log("isAccepted::",!obj["isAccepted"]);
      this.challengeExists = !this.challengeObject["isAccepted"];
      this.challengeFrom = this.challengeObject["fromId"];
    });
  }
  showMessage() {
    console.log("Hey");
  }
  challengeUser(id: string) {
    //this.spinner.show();
    console.log("ChallengeUser: ", id);
    var challengeObj = { "fromId": this.userID, "toId": id }
    var gameId = this.userID + id + "_Game";
    this.userService.postChallenge(challengeObj).subscribe(res => {
      console.log("RESPONSE for challengeUser: ", res)
    });
    this.checkGameInterval = setInterval(() => {
      this.checkGame(gameId);
    },5000)
  }


  getOnlineUsers(id: string){
    this.userService.getOnlineUsers(id).subscribe(res => {
      var resObj = JSON.parse(res["_body"]);
      this.onlineUsers = resObj["liveUsers"];
      let idx=0;
      console.log("USERID::",this.userID);
      console.log("ONLINE_USERS_BEFORE::",this.onlineUsers);
      for(idx=0;idx<this.onlineUsers.length;idx++){
        if(this.onlineUsers[idx] === this.userID){
          console.log("idx::",idx);
          this.onlineUsers.splice(idx,1);
          console.log("ONLINE_USERS_AFTER::",this.onlineUsers);
        }
      }
      console.log("Online Users::",this.onlineUsers);
    })
  }

  startGame(){
    //this.spinner.show();
    this.challengeObject["isAccepted"] = true;
    this.gameObject = this.challengeObject;
    this.redirect = "/game";
    console.log(this.gameObject);
    //this.spinner.hide();
    //this.spinner.show();
    this.userService.initializeGame(this.challengeObject).subscribe(res=>{
      console.log("Response for Update Redis::",res);
      let gameObj = {
        "fromId": this.challengeFrom,
        "toId": this.userID,
        "turn": this.challengeFrom,
        "gameId": this.challengeFrom+this.userID+"_Game"
      }
      sessionStorage.setItem("gameObject",JSON.stringify(gameObj));
      this.router.navigate([this.redirect]);
      //this.spinner.hide();
    });
    
  }
checkGame(gameId: string){
  console.log("gameId",gameId);
  this.userService.getGame(gameId).subscribe(res=>{
    if(res["_body"]){
    //this.spinner.show();
    let redirect = "/game";
    console.log("CHECK_GAME::",JSON.stringify(res["_body"]));
    sessionStorage.setItem("gameObject",(res["_body"]));
    this.router.navigate([redirect]);
    //this.spinner.hide();
    }
    else{
      console.log("GAME NOT ACCEPTED");
    }
  })
}

ngOnDestroy(){
  console.log("Inside OnDestroy");
  clearInterval(this.checkGameInterval);
}


}
