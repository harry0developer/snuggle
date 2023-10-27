
import {
  Component,
  OnInit,
  ElementRef,
  QueryList,
  ViewChildren, 
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { GestureCtrlService } from "src/app/service/gesture-ctrl.service";
import { IonCard } from "@ionic/angular";
import { DataService } from "../../providers/data.service";
import { Subscription } from 'rxjs';

import { User } from '../../models/User';
import { Observable } from "rxjs";


@Component({
  selector: 'app-swipe',
  templateUrl: './swipe.page.html',
  styleUrls: ['./swipe.page.scss'],
})
export class SwipePage implements OnInit {

  users= [
    {
      "id": "3",
      "picture": "../../assets/users/user2.jpg",
      "age": 23,
      "name": "Amanda Du Pont",
      "gender": "female",
      "location": "Midrand",
      "distance": "22"
    },
    {
        "id": "1",
        "picture": "../../assets/users/user6.jpg",
        "age": 28,
        "name": "Simba Potter",
        "gender": "female",
        "location": "Sandton",
        "distance": "12"
    },
    {
        "id": "2",
        "picture": "../../assets/users/user5.jpg",
        "age": 31,
        "name": "Kamo Mphela",
        "gender": "female",
        "location": "Pretoria",
        "distance": "52"
    }];
 
  
    @ViewChildren(IonCard, { read: ElementRef }) cards!: QueryList<ElementRef>;
  
    likeUsers: User[] = [];
    disLikeUsers: User[] = [];
    liked$!: Subscription;
    disLiked$!: Subscription;

    count$!: Observable<Number>;

    startX: number;
    endX: number;


    constructor(
      private gestureCtrlService: GestureCtrlService,
      private cd: ChangeDetectorRef) {}
  
    ngOnInit() {
      
    }

    reload() {
      this.users = this.users;
    }
  


    touchStart(event) {
      this.startX = event.touches[0].pageX;
    } 

    touchMove(event, index) {
      let deltaX = this.startX - event.touches[0].pageX;
      let deg = deltaX / 10;
      this.endX = event.touches[0].pageX;

      console.log("end x ", this.endX);


      (<HTMLStyleElement>document.getElementById("card-" + index)).style.transform = "translateX(" + -deltaX + "px) rotate("+ -deg + "deg";

      if((this.endX - this.startX) < 0 ) {
        (<HTMLStyleElement>document.getElementById("rejected-icon")).style.opacity = String(deltaX / 100)
      } else {
        (<HTMLStyleElement>document.getElementById("accepted-icon")).style.opacity = String(-deltaX / 100)

      }
    } 


    touchEnd(index) {
      if(this.endX > 0) {
        let finalX = this.endX - this.startX;        

        if(finalX > -100 && finalX < 100) {
          (<HTMLStyleElement>document.getElementById("card-" + index)).style.transition = ".3s";
          (<HTMLStyleElement>document.getElementById("card-" + index)).style.transform = "translateX(0px) rotate(0deg)";

          setTimeout(() => {
            (<HTMLStyleElement>document.getElementById("card-" + index)).style.transition = "0s";
          }, 350);

          console.log("Liked");
          
        }
        else if(finalX <= -100) {
          (<HTMLStyleElement>document.getElementById("card-" + index)).style.transition = "1s";
          (<HTMLStyleElement>document.getElementById("card-" + index)).style.transform = "translateX(-1000px) rotate(-30deg)";
          setTimeout(() => {
            this.users.splice(index, 1)
          }, 100);

          console.log("idk Liked");
        }
        
        else  if(finalX >= 100){
          (<HTMLStyleElement>document.getElementById("card-" + index)).style.transition = "1s";
          (<HTMLStyleElement>document.getElementById("card-" + index)).style.transform = "translateX(1000px) rotate(30deg)";
          setTimeout(() => {
            this.users.splice(index, 1)
          }, 100);

          console.log(" Liked");
        }  

        this.startX = 0;
        this.endX = 0;
        (<HTMLStyleElement>document.getElementById('rejected-icon')).style.opacity = "0";
        (<HTMLStyleElement>document.getElementById('accepted-icon')).style.opacity = "0";

      } 
    } 

  }
