import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserService } from '../user.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  template: string = `<img src="http://pa1.narvii.com/5722/2c617cd9674417d272084884b61e4bb7dd5f0b15_hq.gif" />`;
  turn: boolean;
  gameObject: object;
  userObject: object;
  pic: string[][];
  gameId: string;
  tdColor: string;
  defaultPic: string;
  opponentPic: string;
  ifWin: boolean;
  ifLose: boolean;
  ifDraw: boolean;
  win: any;
  turnInterval: any;
  loseInterval: any;
  drawInterval: any;
  tableStyle = {};
  enabledStyle = {
    'background-color': 'white'
  }
  disabledStyle = {
    'background-color': 'grey'
  }
  constructor(private route: ActivatedRoute, private spinner: Ng4LoadingSpinnerService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.spinner.show();
    this.ifWin = false;
    this.ifLose = false;
    this.pic = [['', '', ''], ['', '', ''], ['', '', '']];
    this.gameObject = JSON.parse(sessionStorage.getItem("gameObject"));
    this.gameId = this.gameObject["fromId"] + this.gameObject["toId"] + "_Game";
    //console.log("fromId:",this.gameObject["fromId"]," toId:",this.gameObject["toId"]);
    //console.log("GAME_OBJECT::",this.gameObject);
    let turnValue = this.gameObject["turn"];
    this.userObject = JSON.parse(sessionStorage.getItem("data"));
    if (this.userObject["uid"] === this.gameObject["fromId"]) {
      this.defaultPic = "../../assets/images/x.png";
      this.opponentPic = "../../assets/images/o.png";
    }
    else {
      this.defaultPic = "../../assets/images/o.png";
      this.opponentPic = "../../assets/images/x.png";
    }
    //console.log("GAME_OBJECT::",sessionStorage.getItem("gameObject"));
    //console.log("turnValue::",turnValue," uid::",data["uid"]);
    if (turnValue === this.userObject["uid"]) {
      this.turn = true;
      this.tableStyle = this.enabledStyle;
    }
    else {
      this.tableStyle = this.disabledStyle;
    }
    this.turnInterval = setInterval(() => {
      this.checkTurn();
    }, 1000);

    this.win = setInterval(() => {
      this.checkWin();
    }, 1000);

    this.loseInterval = setInterval(() => {
      this.checkLose();
    }, 1000);
    
    this.drawInterval = setInterval(() => {
      this.checkDraw();
    }, 1000);
  }

  checkTurn() {
    this.userService.getGame(this.gameId).subscribe(res => {
      this.gameObject = JSON.parse(res["_body"]);
      let turnValue = this.gameObject["turn"];
      let lastX = this.gameObject["lastX"];
      let lastY = this.gameObject["lastY"];
      //console.log("TURN_VALUE::",this.gameObject);
      //console.log("UID::",this.userObject["uid"]);
      if (turnValue === this.userObject["uid"]) {
        this.turn = true;
        this.tableStyle = this.enabledStyle;
        this.pic[lastX][lastY] = this.opponentPic;
      }
      else {
        this.turn = false;
        this.tableStyle = this.disabledStyle;
      }
    });
  }

  clicked(x, y) {
    //console.log("Inside Click::",this.gameObject);

    let turnValue = this.gameObject["turn"]
    if (turnValue === this.userObject["uid"]) {
      var obj = this.gameObject;
      if (this.gameObject["turn"] === this.gameObject["fromId"]) {
        this.gameObject["turn"] = this.gameObject["toId"];
        obj["turn"] = this.gameObject["toId"];
      }
      else {
        this.gameObject["turn"] = this.gameObject["fromId"];
        obj["turn"] = this.gameObject["fromId"];
      }
      obj["x"] = x;
      obj["y"] = y;
      obj["madeBy"] = this.userObject["uid"];
      console.log("obj_turnCount::",obj["turnCount"])
      console.log("TYPE_OF::",typeof(obj["turnCount"]))
      obj["turnCount"] = obj["turnCount"] + 1
      this.userService.updateMove(obj).subscribe(res => {
        if (!res["invalidMove"]) {
          this.pic[x][y] = this.defaultPic;
        }
      });
    }
  }

  checkWin() {
    var winObject = this.gameObject;
    //columns
    var arr = this.pic;
    if (arr[0][0] && arr[1][0] && arr[2][0]) {
      if (arr[0][0] === arr[1][0] && arr[0][0] === arr[2][0]) {
        if (arr[0][0] === this.defaultPic) {
          this.ifWin = true;
          winObject["winId"] = this.userObject["uid"];
          this.userService.finishGame(winObject).subscribe(res => {
            //console.log(res);
            clearInterval(this.win);
            clearInterval(this.turnInterval);
          });
        }
      }
    }
    else if (arr[0][1] && arr[1][1] && arr[2][1]) {
      if (arr[0][1] === arr[1][1] && arr[0][1] === arr[2][1]) {
        if (arr[0][1] === this.defaultPic) {
          this.ifWin = true;
          winObject["winId"] = this.userObject["uid"];
          this.userService.finishGame(winObject).subscribe(res => {
            //console.log(res);
            clearInterval(this.win);
            clearInterval(this.turnInterval);
          });
        }
      }
    }
    else if (arr[0][2] && arr[1][2] && arr[2][2]) {
      if (arr[0][2] === arr[1][2] && arr[0][2] === arr[2][2]) {
        if (arr[0][2] === this.defaultPic) {
          this.ifWin = true;
          winObject["winId"] = this.userObject["uid"];
          this.userService.finishGame(winObject).subscribe(res => {
            //console.log(res);
            clearInterval(this.win);
            clearInterval(this.turnInterval);
          });
        }
      }
    }
    //diagonal
    else if (arr[0][0] && arr[1][1] && arr[2][2]) {
      if (arr[0][0] === arr[1][1] && arr[1][1] === arr[2][2]) {
        if (arr[0][0] === this.defaultPic) {
          console.log("First DIAGONAL")
          this.ifWin = true;
          winObject["winId"] = this.userObject["uid"];
          this.userService.finishGame(winObject).subscribe(res => {
            //console.log(res);
            clearInterval(this.win);
            clearInterval(this.turnInterval);
          });
        }
      }
    }
    else if (arr[0][2] && arr[1][1] && arr[2][0]) {
      console.log("PART1")
      if (arr[0][2] === arr[1][1] && arr[1][1] === arr[2][0]) {
        console.log("PART2")
        if (arr[0][2] === this.defaultPic) {
          console.log("PART3")
          this.ifWin = true;
          winObject["winId"] = this.userObject["uid"];
          this.userService.finishGame(winObject).subscribe(res => {
            //console.log(res);
            clearInterval(this.win);
            clearInterval(this.turnInterval);
          });
        }
      }
    }
    //rows
    if (arr[0][0] && arr[0][1] && arr[0][2]) {
      if (arr[0][0] === arr[0][1] && arr[0][0] === arr[0][2]) {
        if (arr[0][0] === this.defaultPic) {
          this.ifWin = true;
          winObject["winId"] = this.userObject["uid"];
          this.userService.finishGame(winObject).subscribe(res => {
            //console.log(res);
            clearInterval(this.win);
            clearInterval(this.turnInterval);
          });
        }
      }
    }
    else if (arr[1][0] && arr[1][1] && arr[1][2]) {
      if (arr[1][0] === arr[1][1] && arr[1][1] === arr[1][2]) {
        if (arr[1][0] === this.defaultPic) {
          this.ifWin = true;
          winObject["winId"] = this.userObject["uid"];
          this.userService.finishGame(winObject).subscribe(res => {
            //console.log(res);
            clearInterval(this.win);
            clearInterval(this.turnInterval);
          });
        }
      }
    }
    else if (arr[2][0] && arr[2][1] && arr[2][2]) {
      if (arr[2][0] === arr[2][1] && arr[2][1] === arr[2][2]) {
        if (arr[2][0] === this.defaultPic) {
          this.ifWin = true;
          winObject["winId"] = this.userObject["uid"];
          this.userService.finishGame(winObject).subscribe(res => {
            //console.log(res);
            clearInterval(this.win);
            clearInterval(this.turnInterval);
          });
        }
      }
    }

  }
  checkLose() {
    this.userService.getGame(this.gameId).subscribe(res => {
      var loseObject = JSON.parse(res["_body"]);
      //console.log("LOSE_OBJECT::",loseObject);
      if (loseObject["win"] && (loseObject["win"] != this.userObject["uid"])) {
        this.turn = false;
        this.ifLose = true;
        clearInterval(this.turnInterval);
      }
    });
  }
  checkDraw(){
    this.userService.getGame(this.gameId).subscribe(res => {
      var drawObject = JSON.parse(res["_body"]);
      if(drawObject["turnCount"]>8){
        this.turn = false;
        this.ifDraw = true;
        clearInterval(this.turnInterval);
      }
    })
  }
  goToHome() {
    this.userService.clearGame(this.gameId).subscribe(res => {
    });
    sessionStorage.removeItem('gameObject');
    this.router.navigate(["/home"]);
  }

  ngOnDestroy(){
    this.spinner.hide();
    clearInterval(this.win);
    clearInterval(this.loseInterval);
    clearInterval(this.loseInterval);
  }

}